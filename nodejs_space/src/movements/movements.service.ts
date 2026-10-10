import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma, MovementStatus, MovementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateMovementDto, ReverseMovementDto } from './dto/movement.dto';
import { lockProducts, currentStocks } from '../common/stock';

/** Stoğu azaltan hareket tipleri (miktar eksi olarak saklanır). */
const SUBTRACTION_TYPES: string[] = ['sevkiyat', 'fire_hasar'];
/** İstemci saatindeki küçük farklara izin verilen pay. */
const FUTURE_TOLERANCE_MS = 5 * 60 * 1000;

const DOC_INCLUDE = {
  createdBy: { select: { id: true, name: true } },
  lines: { include: { product: { select: { name: true } } } },
} satisfies Prisma.MovementDocumentInclude;

type DocWithLines = Prisma.MovementDocumentGetPayload<{
  include: typeof DOC_INCLUDE;
}>;

function formatQty(n: number): string {
  return new Intl.NumberFormat('tr-TR').format(n);
}

@Injectable()
export class MovementsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  private mapDocument(doc: DocWithLines) {
    return {
      id: doc.id,
      documentDate: doc.documentDate,
      type: doc.type,
      notes: doc.notes ?? null,
      status: doc.status,
      reversalOfId: doc.reversalOfId ?? null,
      createdBy: doc.createdBy
        ? { id: doc.createdBy.id, name: doc.createdBy.name }
        : null,
      createdAt: doc.createdAt,
      lines: doc.lines.map((l) => ({
        id: l.id,
        productId: l.productId,
        productName: l.product?.name ?? '',
        quantity: l.quantity,
        packageName: l.packageName,
        packageQuantity: l.packageQuantity,
        conversionFactorUsed: l.conversionFactorUsed,
        notes: l.notes ?? null,
        reason: l.reason ?? null,
      })),
    };
  }

  async findAll(params: {
    type?: string;
    from?: string;
    to?: string;
    productId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const p = Math.max(params.page ?? 1, 1);
    const l = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const skip = (p - 1) * l;
    const where: Prisma.MovementDocumentWhereInput = {};

    if (params.type) where.type = params.type as MovementType;
    if (params.status) where.status = params.status as MovementStatus;
    if (params.from || params.to) {
      const from = params.from ? new Date(params.from) : undefined;
      const to = params.to ? new Date(params.to) : undefined;
      if ((from && isNaN(from.getTime())) || (to && isNaN(to.getTime()))) {
        throw new BadRequestException('Geçersiz tarih');
      }
      where.documentDate = {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      };
    }
    if (params.productId) {
      where.lines = { some: { productId: params.productId } };
    }

    const [items, total] = await Promise.all([
      this.prisma.movementDocument.findMany({
        where,
        skip,
        take: l,
        orderBy: { createdAt: 'desc' },
        include: DOC_INCLUDE,
      }),
      this.prisma.movementDocument.count({ where }),
    ]);

    return {
      items: items.map((d) => this.mapDocument(d)),
      total,
      page: p,
      totalPages: Math.ceil(total / l),
    };
  }

  async findOne(id: string) {
    const doc = await this.prisma.movementDocument.findUnique({
      where: { id },
      include: DOC_INCLUDE,
    });
    if (!doc) throw new NotFoundException('Hareket belgesi bulunamadı');
    return this.mapDocument(doc);
  }

  async create(dto: CreateMovementDto, userId: string) {
    // Aynı anahtarla daha önce kaydedilmiş belge varsa onu döndür (çift kayıt koruması)
    const existing = await this.prisma.movementDocument.findUnique({
      where: { idempotencyKey: dto.idempotencyKey },
      include: DOC_INCLUDE,
    });
    if (existing) return this.mapDocument(existing);

    if (!dto.lines || dto.lines.length === 0) {
      throw new BadRequestException('En az bir satır gereklidir');
    }

    const documentDate = new Date(dto.documentDate);
    if (isNaN(documentDate.getTime()))
      throw new BadRequestException('Geçersiz belge tarihi');
    if (documentDate.getTime() > Date.now() + FUTURE_TOLERANCE_MS) {
      throw new BadRequestException('İleri tarihli hareket girilemez');
    }

    const isCount = dto.type === 'sayim_duzeltmesi';
    for (const line of dto.lines) {
      if (isCount) {
        if (!line.reason || !line.reason.trim()) {
          throw new BadRequestException(
            'Sayım düzeltmesinde sebep alanı zorunludur',
          );
        }
      } else if (line.packageQuantity <= 0) {
        throw new BadRequestException("Miktar 0'dan büyük olmalıdır");
      }
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const productIds = dto.lines.map((l) => l.productId);
        await lockProducts(tx, productIds);

        // Kilit alındıktan sonra tekrar kontrol: aynı anahtarla eşzamanlı gelen istek
        const dup = await tx.movementDocument.findUnique({
          where: { idempotencyKey: dto.idempotencyKey },
          include: DOC_INCLUDE,
        });
        if (dup) return this.mapDocument(dup);

        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
          include: {
            conversions: {
              where: { active: true },
              orderBy: { effectiveFrom: 'desc' },
            },
          },
        });
        const productMap = new Map(products.map((p) => [p.id, p]));

        const errors: string[] = [];
        const lineData = dto.lines.map((line) => {
          const product = productMap.get(line.productId);
          if (!product)
            throw new NotFoundException(`Ürün bulunamadı: ${line.productId}`);

          // Başlangıç sayımı kuralı: sayım girilmeden ürüne hareket girilemez.
          if (product.initialCount === null || !product.initialDate) {
            errors.push(
              `${product.name}: Önce başlangıç stoğu girilmelidir (Ürün detayı → Başlangıç Stoğu)`,
            );
          } else if (documentDate < product.initialDate) {
            errors.push(
              `${product.name}: Başlangıç sayımı tarihinden önceye hareket girilemez`,
            );
          }

          // Paket dönüşümü sunucuda doğrulanır; istemcinin gönderdiği katsayıya güvenilmez.
          const pkg = line.packageName.trim();
          let factor: number;
          if (pkg.toLocaleLowerCase('tr') === product.baseUnit) {
            factor = 1;
          } else {
            const ref = new Date(Math.max(documentDate.getTime(), Date.now()));
            const conv = product.conversions.find(
              (c) =>
                c.packageName.toLocaleLowerCase('tr') ===
                  pkg.toLocaleLowerCase('tr') && c.effectiveFrom <= ref,
            );
            if (!conv) {
              throw new BadRequestException(
                `${product.name}: "${pkg}" paket birimi tanımlı değil`,
              );
            }
            factor = conv.conversionFactor;
          }
          if (line.conversionFactorUsed !== factor) {
            throw new BadRequestException(
              `${product.name}: "${pkg}" için geçerli katsayı ${factor}. Lütfen ekranı yenileyip tekrar deneyin.`,
            );
          }

          const raw = line.packageQuantity * factor;
          const baseQty = Math.round(raw);
          if (Math.abs(raw - baseQty) > 1e-6 || baseQty === 0) {
            throw new BadRequestException(
              `${product.name}: Miktar ${product.baseUnit} cinsinden tam sayı olmalıdır (girilen: ${formatQty(raw)})`,
            );
          }

          let signedQty = baseQty;
          if (SUBTRACTION_TYPES.includes(dto.type))
            signedQty = -Math.abs(baseQty);

          return {
            productId: product.id,
            productName: product.name,
            quantity: signedQty,
            packageName: pkg,
            packageQuantity: line.packageQuantity,
            conversionFactorUsed: factor,
            notes: line.notes?.trim() || null,
            reason: line.reason?.trim() || null,
          };
        });
        if (errors.length > 0)
          throw new UnprocessableEntityException(errors.join('; '));

        // Negatif stok kontrolü: aynı ürün birden fazla satırda olabilir, toplamına bakılır.
        const deltas = new Map<string, number>();
        for (const l of lineData)
          deltas.set(l.productId, (deltas.get(l.productId) ?? 0) + l.quantity);
        const stocks = await currentStocks(tx, [...deltas.keys()]);

        // Sayım koruması: kullanıcı farkı ekranda gördüğü stoka göre hesapladı. Arada başka
        // bir işlem stoğu değiştirdiyse eski değere göre sessizce düzeltme yapılmaz.
        const expected = new Map<string, number>();
        for (const line of dto.lines) {
          if (line.expectedStock === undefined) continue;
          if (expected.has(line.productId)) {
            throw new BadRequestException('Sayımda bir ürün yalnızca bir kez yer alabilir');
          }
          expected.set(line.productId, line.expectedStock);
        }
        for (const [pid, exp] of expected) {
          const cur = stocks.get(pid) ?? 0;
          if (cur !== exp) {
            const p = productMap.get(pid)!;
            throw new ConflictException({
              statusCode: 409,
              code: 'STOCK_CHANGED',
              productId: pid,
              currentStock: cur,
              message: `${p.name}: Stok siz sayarken değişti (ekranda ${formatQty(exp)}, şu an ${formatQty(cur)}). Güncel stokla tekrar kontrol edin.`,
            });
          }
        }
        for (const [pid, delta] of deltas) {
          if (delta >= 0) continue;
          const current = stocks.get(pid) ?? 0;
          if (current + delta < 0) {
            const p = productMap.get(pid)!;
            errors.push(
              `${p.name}: Yetersiz stok (mevcut: ${formatQty(current)}, düşülmek istenen: ${formatQty(-delta)})`,
            );
          }
        }
        if (errors.length > 0)
          throw new UnprocessableEntityException(errors.join('; '));

        const doc = await tx.movementDocument.create({
          data: {
            idempotencyKey: dto.idempotencyKey,
            documentDate,
            type: dto.type as MovementType,
            notes: dto.notes?.trim() || null,
            createdById: userId,
            lines: {
              create: lineData.map((l) => ({
                productId: l.productId,
                quantity: l.quantity,
                packageName: l.packageName,
                packageQuantity: l.packageQuantity,
                conversionFactorUsed: l.conversionFactorUsed,
                notes: l.notes,
                reason: l.reason,
              })),
            },
          },
          include: DOC_INCLUDE,
        });

        await tx.auditLog.create({
          data: {
            action: 'movement_created',
            entityType: 'MovementDocument',
            entityId: doc.id,
            actorId: userId,
            details: JSON.stringify({
              type: dto.type,
              lineCount: dto.lines.length,
            }),
          },
        });

        return this.mapDocument(doc);
      });
    } catch (e) {
      // Aynı anahtarla eşzamanlı ikinci istek: kaydedilmiş belgeyi döndür
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        const again = await this.prisma.movementDocument.findUnique({
          where: { idempotencyKey: dto.idempotencyKey },
          include: DOC_INCLUDE,
        });
        if (again) return this.mapDocument(again);
      }
      throw e;
    }
  }

  async reverse(id: string, dto: ReverseMovementDto, userId: string) {
    const original = await this.prisma.movementDocument.findUnique({
      where: { id },
      include: { lines: true },
    });
    if (!original) throw new NotFoundException('Hareket belgesi bulunamadı');
    if (original.reversalOfId) {
      throw new ConflictException('İptal kaydı tekrar iptal edilemez');
    }
    if (original.status === MovementStatus.reversed) {
      throw new ConflictException('Bu belge zaten iptal edilmiş');
    }

    return await this.prisma.$transaction(async (tx) => {
      await lockProducts(
        tx,
        original.lines.map((l) => l.productId),
      );

      // Durum yalnızca hâlâ "active" ise değişir: eşzamanlı iki iptalden biri kazanır.
      const marked = await tx.movementDocument.updateMany({
        where: { id, status: MovementStatus.active },
        data: { status: MovementStatus.reversed },
      });
      if (marked.count === 0)
        throw new ConflictException('Bu belge zaten iptal edilmiş');

      // İptal, belgenin stok etkisini geri alır. Geri alma stoğu eksiye düşürecekse engellenir
      // (ör. gelen malın bir kısmı sevk edilmişse mal kabul iptal edilemez).
      const deltas = new Map<string, number>();
      for (const l of original.lines)
        deltas.set(l.productId, (deltas.get(l.productId) ?? 0) + l.quantity);
      // Belge artık "reversed" olduğundan currentStocks onu saymaz = iptal sonrası stok
      const after = await currentStocks(tx, [...deltas.keys()]);
      const products = await tx.product.findMany({
        where: { id: { in: [...deltas.keys()] } },
      });
      const errors: string[] = [];
      for (const p of products) {
        const stock = after.get(p.id) ?? 0;
        if (stock < 0) {
          errors.push(
            `${p.name}: İptal sonrası stok eksiye düşer (${formatQty(stock)}). Önce sonraki hareketleri düzeltin.`,
          );
        }
      }
      if (errors.length > 0)
        throw new UnprocessableEntityException(errors.join('; '));

      // Denetim izi için ters kayıt belgesi. Stok hesabına katılmaz (durumu "reversed").
      const reversalDoc = await tx.movementDocument.create({
        data: {
          idempotencyKey: randomUUID(),
          documentDate: new Date(),
          type: original.type,
          notes: dto.notes?.trim() || `İptal: ${original.notes ?? ''}`.trim(),
          status: MovementStatus.reversed,
          reversalOfId: id,
          createdById: userId,
          lines: {
            create: original.lines.map((l) => ({
              productId: l.productId,
              quantity: -l.quantity,
              packageName: l.packageName,
              packageQuantity: l.packageQuantity,
              conversionFactorUsed: l.conversionFactorUsed,
              notes: l.notes,
              reason: l.reason,
            })),
          },
        },
        include: DOC_INCLUDE,
      });

      await tx.auditLog.create({
        data: {
          action: 'movement_reversed',
          entityType: 'MovementDocument',
          entityId: id,
          actorId: userId,
          details: JSON.stringify({ reversalId: reversalDoc.id }),
        },
      });

      return { reversalDocument: this.mapDocument(reversalDoc) };
    });
  }
}
