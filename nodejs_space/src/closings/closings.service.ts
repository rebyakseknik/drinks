import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  addDays,
  closingDateValue,
  istanbulDay,
  parseBusinessDay,
} from '../common/dates';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateClosingDto, UpdateClosingDto } from './dto/closing.dto';

@Injectable()
export class ClosingsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  private mapClosing(c: any) {
    return {
      id: c.id,
      businessDate: c.businessDate,
      netCashKurus: c.netCashKurus,
      netCardKurus: c.netCardKurus,
      totalRevenueKurus: c.totalRevenueKurus,
      notes: c.notes ?? null,
      version: c.version,
      createdBy: c.createdBy
        ? { id: c.createdBy.id, name: c.createdBy.name }
        : null,
      updatedBy: c.updatedBy
        ? { id: c.updatedBy.id, name: c.updatedBy.name }
        : null,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }

  async findAll(params: {
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  }) {
    const p = params.page ?? 1;
    const l = Math.min(params.limit ?? 31, 100);
    const skip = (p - 1) * l;
    const where: Record<string, unknown> = {};

    if (params.from || params.to) {
      try {
        where.businessDate = {
          ...(params.from
            ? { gte: closingDateValue(parseBusinessDay(params.from)) }
            : {}),
          ...(params.to
            ? { lte: closingDateValue(parseBusinessDay(params.to)) }
            : {}),
        };
      } catch {
        throw new BadRequestException('Geçersiz tarih');
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.dailyClosing.findMany({
        where,
        skip,
        take: l,
        orderBy: { businessDate: 'desc' },
        include: {
          createdBy: { select: { id: true, name: true } },
          updatedBy: { select: { id: true, name: true } },
        },
      }),
      this.prisma.dailyClosing.count({ where }),
    ]);

    return {
      items: items.map((c) => this.mapClosing(c)),
      total,
      page: p,
      totalPages: Math.ceil(total / l),
    };
  }

  async findOne(id: string) {
    const c = await this.prisma.dailyClosing.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true } },
        updatedBy: { select: { id: true, name: true } },
      },
    });
    if (!c) throw new NotFoundException('Kapanış kaydı bulunamadı');
    return this.mapClosing(c);
  }

  async create(dto: CreateClosingDto, userId: string) {
    let day: string;
    try {
      day = parseBusinessDay(dto.businessDate);
    } catch {
      throw new BadRequestException('Geçersiz tarih');
    }
    if (day > istanbulDay())
      throw new BadRequestException('İleri tarihli kapanış girilemez');
    const businessDate = closingDateValue(day);

    const existing = await this.prisma.dailyClosing.findUnique({
      where: { businessDate },
    });
    if (existing)
      throw new ConflictException('Bu tarih için zaten kapanış kaydı mevcut');

    const total = dto.netCashKurus + dto.netCardKurus;
    let c;
    try {
      c = await this.prisma.dailyClosing.create({
        data: {
          businessDate,
          netCashKurus: dto.netCashKurus,
          netCardKurus: dto.netCardKurus,
          totalRevenueKurus: total,
          notes: dto.notes?.trim() || null,
          createdById: userId,
        },
        include: {
          createdBy: { select: { id: true, name: true } },
          updatedBy: { select: { id: true, name: true } },
        },
      });
    } catch (e) {
      // Aynı gün için eşzamanlı ikinci kayıt
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Bu tarih için zaten kapanış kaydı mevcut');
      }
      throw e;
    }

    await this.auditService.log({
      action: 'closing_created',
      entityType: 'DailyClosing',
      entityId: c.id,
      actorId: userId,
      details: { businessDate: day, total },
    });

    return this.mapClosing(c);
  }

  async update(id: string, dto: UpdateClosingDto, userId: string) {
    const c = await this.prisma.dailyClosing.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Kapanış kaydı bulunamadı');
    if (c.version !== dto.version) {
      throw new ConflictException(
        'Bu kayıt başka biri tarafından güncellendi. Lütfen yenileyin.',
      );
    }

    const netCash = dto.netCashKurus ?? c.netCashKurus;
    const netCard = dto.netCardKurus ?? c.netCardKurus;
    const total = netCash + netCard;

    // Sürüm kontrolü veritabanında yapılır: aynı sürümle gelen eşzamanlı iki
    // düzeltmeden yalnızca biri kaydedilir, diğeri "başka biri güncelledi" hatası alır.
    const result = await this.prisma.dailyClosing.updateMany({
      where: { id, version: dto.version },
      data: {
        netCashKurus: netCash,
        netCardKurus: netCard,
        totalRevenueKurus: total,
        notes: dto.notes !== undefined ? dto.notes.trim() || null : c.notes,
        version: { increment: 1 },
        updatedById: userId,
      },
    });
    if (result.count === 0) {
      throw new ConflictException(
        'Bu kayıt başka biri tarafından güncellendi. Lütfen yenileyin.',
      );
    }
    const updated = await this.prisma.dailyClosing.findUniqueOrThrow({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true } },
        updatedBy: { select: { id: true, name: true } },
      },
    });

    await this.auditService.log({
      action: 'closing_updated',
      entityType: 'DailyClosing',
      entityId: id,
      actorId: userId,
      details: { netCash, netCard, total, version: updated.version },
    });

    return this.mapClosing(updated);
  }

  async today() {
    const todayStart = closingDateValue(istanbulDay());

    const c = await this.prisma.dailyClosing.findUnique({
      where: { businessDate: todayStart },
      include: {
        createdBy: { select: { id: true, name: true } },
        updatedBy: { select: { id: true, name: true } },
      },
    });

    return { closing: c ? this.mapClosing(c) : null };
  }

  async summary(date?: string) {
    let day: string;
    try {
      day = date ? parseBusinessDay(date) : istanbulDay();
    } catch {
      throw new BadRequestException('Geçersiz tarih');
    }
    const ref = closingDateValue(day);
    const year = ref.getUTCFullYear();
    const month = ref.getUTCMonth();
    const monthStart = new Date(Date.UTC(year, month, 1));
    const monthEnd = new Date(Date.UTC(year, month + 1, 0));
    const daysInMonth = monthEnd.getUTCDate();

    const closings = await this.prisma.dailyClosing.findMany({
      where: {
        businessDate: { gte: monthStart, lte: monthEnd },
      },
    });

    const totalCash = closings.reduce((s, c) => s + c.netCashKurus, 0);
    const totalCard = closings.reduce((s, c) => s + c.netCardKurus, 0);

    return {
      totalRevenueKurus: totalCash + totalCard,
      totalCashKurus: totalCash,
      totalCardKurus: totalCard,
      daysRecorded: closings.length,
      daysInPeriod: daysInMonth,
    };
  }

  async comparison() {
    const today = istanbulDay();
    const todayStart = closingDateValue(today);
    const lastWeekStart = closingDateValue(addDays(today, -7));

    const [todayClosing, lastWeekClosing] = await Promise.all([
      this.prisma.dailyClosing.findUnique({
        where: { businessDate: todayStart },
      }),
      this.prisma.dailyClosing.findUnique({
        where: { businessDate: lastWeekStart },
      }),
    ]);

    const todayData = todayClosing
      ? {
          date: todayClosing.businessDate,
          totalRevenueKurus: todayClosing.totalRevenueKurus,
        }
      : null;
    const lastWeekData = lastWeekClosing
      ? {
          date: lastWeekClosing.businessDate,
          totalRevenueKurus: lastWeekClosing.totalRevenueKurus,
        }
      : null;

    let changePercent: number | null = null;
    if (todayData && lastWeekData && lastWeekData.totalRevenueKurus > 0) {
      changePercent =
        ((todayData.totalRevenueKurus - lastWeekData.totalRevenueKurus) /
          lastWeekData.totalRevenueKurus) *
        100;
    }

    return { today: todayData, lastWeek: lastWeekData, changePercent };
  }
}
