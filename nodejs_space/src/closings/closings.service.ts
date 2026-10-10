import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
      createdBy: c.createdBy ? { id: c.createdBy.id, name: c.createdBy.name } : null,
      updatedBy: c.updatedBy ? { id: c.updatedBy.id, name: c.updatedBy.name } : null,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }

  private getIstanbulStartOfDay(dateStr: string): Date {
    // Parse date as Istanbul date and return start of that day in UTC
    const d = new Date(dateStr);
    // Set to start of day UTC
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async findAll(params: { from?: string; to?: string; page?: number; limit?: number }) {
    const p = params.page ?? 1;
    const l = Math.min(params.limit ?? 31, 100);
    const skip = (p - 1) * l;
    const where: Record<string, unknown> = {};

    if (params.from || params.to) {
      where.businessDate = {
        ...(params.from ? { gte: new Date(params.from) } : {}),
        ...(params.to ? { lte: new Date(params.to) } : {}),
      };
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
    const businessDate = this.getIstanbulStartOfDay(dto.businessDate);

    const existing = await this.prisma.dailyClosing.findUnique({ where: { businessDate } });
    if (existing) throw new ConflictException('Bu tarih için zaten kapanış kaydı mevcut');

    const total = dto.netCashKurus + dto.netCardKurus;
    const c = await this.prisma.dailyClosing.create({
      data: {
        businessDate,
        netCashKurus: dto.netCashKurus,
        netCardKurus: dto.netCardKurus,
        totalRevenueKurus: total,
        notes: dto.notes ?? null,
        createdById: userId,
      },
      include: {
        createdBy: { select: { id: true, name: true } },
        updatedBy: { select: { id: true, name: true } },
      },
    });

    await this.auditService.log({
      action: 'closing_created',
      entityType: 'DailyClosing',
      entityId: c.id,
      actorId: userId,
      details: { businessDate: dto.businessDate, total },
    });

    return this.mapClosing(c);
  }

  async update(id: string, dto: UpdateClosingDto, userId: string) {
    const c = await this.prisma.dailyClosing.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Kapanış kaydı bulunamadı');
    if (c.version !== dto.version) {
      throw new ConflictException('Bu kayıt başka biri tarafından güncellendi. Lütfen yenileyin.');
    }

    const netCash = dto.netCashKurus ?? c.netCashKurus;
    const netCard = dto.netCardKurus ?? c.netCardKurus;
    const total = netCash + netCard;

    const updated = await this.prisma.dailyClosing.update({
      where: { id },
      data: {
        netCashKurus: netCash,
        netCardKurus: netCard,
        totalRevenueKurus: total,
        notes: dto.notes !== undefined ? dto.notes : c.notes,
        version: c.version + 1,
        updatedById: userId,
      },
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
    const now = new Date();
    // Istanbul is UTC+3
    const istanbulOffset = 3 * 60 * 60 * 1000;
    const istanbulNow = new Date(now.getTime() + istanbulOffset);
    const todayStart = new Date(Date.UTC(istanbulNow.getUTCFullYear(), istanbulNow.getUTCMonth(), istanbulNow.getUTCDate()));

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
    const now = new Date();
    const istanbulOffset = 3 * 60 * 60 * 1000;
    const istanbulNow = date ? new Date(date) : new Date(now.getTime() + istanbulOffset);
    const year = istanbulNow.getUTCFullYear();
    const month = istanbulNow.getUTCMonth();
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
    const now = new Date();
    const istanbulOffset = 3 * 60 * 60 * 1000;
    const istanbulNow = new Date(now.getTime() + istanbulOffset);
    const todayStart = new Date(Date.UTC(istanbulNow.getUTCFullYear(), istanbulNow.getUTCMonth(), istanbulNow.getUTCDate()));
    const lastWeekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [todayClosing, lastWeekClosing] = await Promise.all([
      this.prisma.dailyClosing.findUnique({ where: { businessDate: todayStart } }),
      this.prisma.dailyClosing.findUnique({ where: { businessDate: lastWeekStart } }),
    ]);

    const todayData = todayClosing
      ? { date: todayClosing.businessDate, totalRevenueKurus: todayClosing.totalRevenueKurus }
      : null;
    const lastWeekData = lastWeekClosing
      ? { date: lastWeekClosing.businessDate, totalRevenueKurus: lastWeekClosing.totalRevenueKurus }
      : null;

    let changePercent: number | null = null;
    if (todayData && lastWeekData && lastWeekData.totalRevenueKurus > 0) {
      changePercent = ((todayData.totalRevenueKurus - lastWeekData.totalRevenueKurus) / lastWeekData.totalRevenueKurus) * 100;
    }

    return { today: todayData, lastWeek: lastWeekData, changePercent };
  }
}
