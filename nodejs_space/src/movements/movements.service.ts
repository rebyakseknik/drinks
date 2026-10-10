import { Injectable, NotFoundException, ConflictException, UnprocessableEntityException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateMovementDto, ReverseMovementDto } from './dto/movement.dto';
import { MovementStatus, MovementType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const SUBTRACTION_TYPES: string[] = ['sevkiyat', 'fire_hasar'];

@Injectable()
export class MovementsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  private mapDocument(doc: any) {
    return {
      id: doc.id,
      documentDate: doc.documentDate,
      type: doc.type,
      notes: doc.notes ?? null,
      status: doc.status,
      reversalOfId: doc.reversalOfId ?? null,
      createdBy: doc.createdBy ? { id: doc.createdBy.id, name: doc.createdBy.name } : null,
      createdAt: doc.createdAt,
      lines: (doc.lines ?? []).map((l: any) => ({
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
    type?: string; from?: string; to?: string; productId?: string;
    status?: string; page?: number; limit?: number;
  }) {
    const p = params.page ?? 1;
    const l = Math.min(params.limit ?? 20, 100);
    const skip = (p - 1) * l;
    const where: Record<string, unknown> = {};

    if (params.type) where.type = params.type;
    if (params.status) where.status = params.status;
    if (params.from || params.to) {
      where.documentDate = {
        ...(params.from ? { gte: new Date(params.from) } : {}),
        ...(params.to ? { lte: new Date(params.to) } : {}),
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
        include: {
          createdBy: { select: { id: true, name: true } },
          lines: { include: { product: { select: { name: true } } } },
        },
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
      include: {
        createdBy: { select: { id: true, name: true } },
        lines: { include: { product: { select: { name: true } } } },
      },
    });
    if (!doc) throw new NotFoundException('Hareket belgesi bulunamadı');
    return this.mapDocument(doc);
  }

  async create(dto: CreateMovementDto, userId: string) {
    // Check idempotency
    const existing = await this.prisma.movementDocument.findUnique({
      where: { idempotencyKey: dto.idempotencyKey },
      include: {
        createdBy: { select: { id: true, name: true } },
        lines: { include: { product: { select: { name: true } } } },
      },
    });
    if (existing) return this.mapDocument(existing);

    if (!dto.lines || dto.lines.length === 0) {
      throw new BadRequestException('En az bir satır gereklidir');
    }

    // Validate sayim_duzeltmesi requires reason
    if (dto.type === 'sayim_duzeltmesi') {
      for (const line of dto.lines) {
        if (!line.reason) throw new BadRequestException('Sayım düzeltmesinde sebep alanı zorunludur');
      }
    }

    // Calculate quantities and check stock
    const lineData = dto.lines.map((line) => {
      const baseQty = Math.round(line.packageQuantity * line.conversionFactorUsed);
      let signedQty: number;
      if (dto.type === 'sayim_duzeltmesi') {
        // For sayim_duzeltmesi, quantity can be positive or negative
        // packageQuantity is always positive, sign determined by context
        // We'll use the value as-is (positive = add, caller can negate if needed)
        signedQty = baseQty;
      } else if (SUBTRACTION_TYPES.includes(dto.type)) {
        signedQty = -baseQty;
      } else {
        signedQty = baseQty;
      }
      return { ...line, quantity: signedQty };
    });

    return await this.prisma.$transaction(async (tx) => {
      // Check negative stock for subtraction types
      if (SUBTRACTION_TYPES.includes(dto.type)) {
        const errors: string[] = [];
        for (const line of lineData) {
          const product = await tx.product.findUnique({ where: { id: line.productId } });
          if (!product) throw new NotFoundException(`Ürün bulunamadı: ${line.productId}`);

          const initialStock = product.initialCount ?? 0;
          const movementSum = await tx.movementLine.aggregate({
            where: {
              productId: line.productId,
              document: { status: MovementStatus.active },
            },
            _sum: { quantity: true },
          });
          const currentStock = initialStock + (movementSum._sum.quantity ?? 0);
          const newStock = currentStock + line.quantity; // quantity is negative for subtraction
          if (newStock < 0) {
            errors.push(`${product.name}: Yetersiz stok (mevcut: ${currentStock}, talep: ${Math.abs(line.quantity)})`);
          }
        }
        if (errors.length > 0) {
          throw new UnprocessableEntityException(errors.join('; '));
        }
      }

      const doc = await tx.movementDocument.create({
        data: {
          idempotencyKey: dto.idempotencyKey,
          documentDate: new Date(dto.documentDate),
          type: dto.type as MovementType,
          notes: dto.notes ?? null,
          createdById: userId,
          lines: {
            create: lineData.map((l) => ({
              productId: l.productId,
              quantity: l.quantity,
              packageName: l.packageName,
              packageQuantity: l.packageQuantity,
              conversionFactorUsed: l.conversionFactorUsed,
              notes: l.notes ?? null,
              reason: l.reason ?? null,
            })),
          },
        },
        include: {
          createdBy: { select: { id: true, name: true } },
          lines: { include: { product: { select: { name: true } } } },
        },
      });

      await this.auditService.log({
        action: 'movement_created',
        entityType: 'MovementDocument',
        entityId: doc.id,
        actorId: userId,
        details: { type: dto.type, lineCount: dto.lines.length },
      });

      return this.mapDocument(doc);
    });
  }

  async reverse(id: string, dto: ReverseMovementDto, userId: string) {
    const original = await this.prisma.movementDocument.findUnique({
      where: { id },
      include: { lines: true },
    });
    if (!original) throw new NotFoundException('Hareket belgesi bulunamadı');
    if (original.status === MovementStatus.reversed) {
      throw new ConflictException('Bu belge zaten iptal edilmiş');
    }

    return await this.prisma.$transaction(async (tx) => {
      // Mark original as reversed
      await tx.movementDocument.update({
        where: { id },
        data: { status: MovementStatus.reversed },
      });

      // Create reversal document with negated quantities
      const reversalDoc = await tx.movementDocument.create({
        data: {
          idempotencyKey: uuidv4(),
          documentDate: new Date(),
          type: original.type,
          notes: dto.notes ?? `İptal: ${original.notes ?? ''}`,
          status: MovementStatus.active,
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
        include: {
          createdBy: { select: { id: true, name: true } },
          lines: { include: { product: { select: { name: true } } } },
        },
      });

      await this.auditService.log({
        action: 'movement_reversed',
        entityType: 'MovementDocument',
        entityId: id,
        actorId: userId,
        details: { reversalId: reversalDoc.id },
      });

      return { reversalDocument: this.mapDocument(reversalDoc) };
    });
  }
}
