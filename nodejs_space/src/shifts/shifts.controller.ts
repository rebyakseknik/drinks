import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  addDays,
  closingDateValue,
  isValidDay,
  parseDayRange,
} from '../common/dates';
import { Prisma } from '@prisma/client';
import {
  CopyWeekDto,
  CopyWeekResponseDto,
  CreateShiftDto,
  DeleteShiftResponseDto,
  ShiftListResponseDto,
  ShiftResponseDto,
  UpdateShiftDto,
} from './dto/shift.dto';

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function shiftMinutes(start: string, end: string): number {
  const diff = toMinutes(end) - toMinutes(start);
  return diff > 0 ? diff : diff + 24 * 60;
}

/** Vardiyayı mutlak dakika aralığına çevirir (gece yarısını geçen vardiya ertesi güne uzar). */
function interval(day: string, start: string, end: string): [number, number] {
  const base = Math.round(new Date(`${day}T00:00:00.000Z`).getTime() / 60000);
  const s = base + toMinutes(start);
  return [s, s + shiftMinutes(start, end)];
}

function overlaps(a: [number, number], b: [number, number]): boolean {
  return a[0] < b[1] && b[0] < a[1];
}

type Tx = Prisma.TransactionClient;

/** 2026-10-05 → 05.10.2026 */
function trDate(d: Date): string {
  const [y, m, day] = d.toISOString().slice(0, 10).split('-');
  return `${day}.${m}.${y}`;
}

/** Aynı personelin bu aralıkla çakışan vardiyasını bulur (önceki/sonraki gün dahil). */
async function findOverlap(
  tx: Tx,
  staffId: string,
  day: string,
  start: string,
  end: string,
  excludeId?: string,
) {
  const near = await tx.shift.findMany({
    where: {
      staffId,
      businessDate: {
        gte: closingDateValue(addDays(day, -1)),
        lte: closingDateValue(addDays(day, 1)),
      },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
  const mine = interval(day, start, end);
  return (
    near.find((o) =>
      overlaps(
        mine,
        interval(
          o.businessDate.toISOString().slice(0, 10),
          o.startTime,
          o.endTime,
        ),
      ),
    ) ?? null
  );
}

/** Aynı personel için eşzamanlı vardiya kayıtlarını sıraya sokar. */
async function lockStaff(tx: Tx, staffId: string) {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${'shift:' + staffId}))`;
}

type ShiftRow = {
  id: string;
  businessDate: Date;
  startTime: string;
  endTime: string;
  notes: string | null;
  staff: { id: string; name: string };
};

function toDto(s: ShiftRow): ShiftResponseDto {
  return {
    id: s.id,
    businessDate: s.businessDate.toISOString().slice(0, 10),
    startTime: s.startTime,
    endTime: s.endTime,
    minutes: shiftMinutes(s.startTime, s.endTime),
    notes: s.notes,
    staff: { id: s.staff.id, name: s.staff.name },
  };
}

const include = { staff: { select: { id: true, name: true } } } as const;

@Controller('api/shifts')
@UseGuards(JwtAuthGuard)
export class ShiftsController {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  @Get()
  async findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<ShiftListResponseDto> {
    let range: { fromDay: string; toDay: string };
    try {
      range = parseDayRange(from, to);
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
    const rows = await this.prisma.shift.findMany({
      where: {
        businessDate: {
          gte: closingDateValue(range.fromDay),
          lte: closingDateValue(range.toDay),
        },
      },
      include,
      orderBy: [{ businessDate: 'asc' }, { startTime: 'asc' }],
    });
    const items = rows.map(toDto);
    const totalsMap = new Map<
      string,
      { staffId: string; name: string; shiftCount: number; minutes: number }
    >();
    for (const it of items) {
      const t = totalsMap.get(it.staff.id) ?? {
        staffId: it.staff.id,
        name: it.staff.name,
        shiftCount: 0,
        minutes: 0,
      };
      t.shiftCount += 1;
      t.minutes += it.minutes;
      totalsMap.set(it.staff.id, t);
    }
    const totals = [...totalsMap.values()].sort((a, b) =>
      a.name.localeCompare(b.name, 'tr'),
    );
    return { items, totals };
  }

  @Post()
  async create(
    @Body() dto: CreateShiftDto,
    @CurrentUser() user: { id: string },
  ): Promise<ShiftResponseDto> {
    if (!isValidDay(dto.businessDate))
      throw new BadRequestException('Geçersiz tarih');
    if (dto.startTime === dto.endTime)
      throw new BadRequestException('Başlangıç ve bitiş saati aynı olamaz');
    const staff = await this.prisma.staff.findUnique({
      where: { id: dto.staffId },
    });
    if (!staff) throw new BadRequestException('Personel bulunamadı');
    const s = await this.prisma.$transaction(async (tx) => {
      await lockStaff(tx, dto.staffId);
      const clash = await findOverlap(
        tx,
        dto.staffId,
        dto.businessDate,
        dto.startTime,
        dto.endTime,
      );
      if (clash) {
        throw new ConflictException(
          `${staff.name} için bu saatlerle çakışan vardiya var (${trDate(clash.businessDate)} ${clash.startTime}–${clash.endTime})`,
        );
      }
      return tx.shift.create({
        data: {
          staffId: dto.staffId,
          businessDate: closingDateValue(dto.businessDate),
          startTime: dto.startTime,
          endTime: dto.endTime,
          notes: dto.notes?.trim() || null,
          createdById: user.id,
        },
        include,
      });
    });
    await this.audit.log({
      action: 'shift_created',
      entityType: 'shift',
      entityId: s.id,
      actorId: user.id,
      details: {
        staff: staff.name,
        date: dto.businessDate,
        start: dto.startTime,
        end: dto.endTime,
      },
    });
    return toDto(s);
  }

  /** Bir haftanın vardiyalarını başka bir haftaya kopyalar. Çakışanlar ve pasif personel atlanır. */
  @Post('copy-week')
  async copyWeek(
    @Body() dto: CopyWeekDto,
    @CurrentUser() user: { id: string },
  ): Promise<CopyWeekResponseDto> {
    if (!isValidDay(dto.fromWeekStart) || !isValidDay(dto.toWeekStart))
      throw new BadRequestException('Geçersiz tarih');
    if (dto.fromWeekStart === dto.toWeekStart)
      throw new BadRequestException('Kaynak ve hedef hafta aynı olamaz');
    const offsetDays = Math.round(
      (new Date(`${dto.toWeekStart}T00:00:00Z`).getTime() -
        new Date(`${dto.fromWeekStart}T00:00:00Z`).getTime()) /
        86400000,
    );
    const source = await this.prisma.shift.findMany({
      where: {
        businessDate: {
          gte: closingDateValue(dto.fromWeekStart),
          lte: closingDateValue(addDays(dto.fromWeekStart, 6)),
        },
      },
      include: { staff: true },
      orderBy: [{ businessDate: 'asc' }, { startTime: 'asc' }],
    });

    const result = await this.prisma.$transaction(async (tx) => {
      let created = 0;
      const reasons: string[] = [];
      for (const staffId of [...new Set(source.map((x) => x.staffId))].sort())
        await lockStaff(tx, staffId);
      for (const src of source) {
        const day = addDays(
          src.businessDate.toISOString().slice(0, 10),
          offsetDays,
        );
        const label = `${src.staff.name} ${trDate(closingDateValue(day))} ${src.startTime}–${src.endTime}`;
        if (!src.staff.active) {
          reasons.push(`${label}: personel pasif`);
          continue;
        }
        if (
          await findOverlap(tx, src.staffId, day, src.startTime, src.endTime)
        ) {
          reasons.push(`${label}: zaten vardiya var`);
          continue;
        }
        await tx.shift.create({
          data: {
            staffId: src.staffId,
            businessDate: closingDateValue(day),
            startTime: src.startTime,
            endTime: src.endTime,
            notes: src.notes,
            createdById: user.id,
          },
        });
        created++;
      }
      return {
        created,
        skipped: reasons.length,
        skippedReasons: reasons.slice(0, 10),
      };
    });

    await this.audit.log({
      action: 'shift_week_copied',
      entityType: 'shift',
      entityId: dto.toWeekStart,
      actorId: user.id,
      details: {
        from: dto.fromWeekStart,
        to: dto.toWeekStart,
        created: result.created,
        skipped: result.skipped,
      },
    });
    return result;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateShiftDto,
    @CurrentUser() user: { id: string },
  ): Promise<ShiftResponseDto> {
    const existing = await this.prisma.shift.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Vardiya bulunamadı');
    const start = dto.startTime ?? existing.startTime;
    const end = dto.endTime ?? existing.endTime;
    if (start === end)
      throw new BadRequestException('Başlangıç ve bitiş saati aynı olamaz');
    if (dto.businessDate && !isValidDay(dto.businessDate))
      throw new BadRequestException('Geçersiz tarih');
    const staffId = dto.staffId ?? existing.staffId;
    const staff = await this.prisma.staff.findUnique({
      where: { id: staffId },
    });
    if (!staff) throw new BadRequestException('Personel bulunamadı');
    const day =
      dto.businessDate ?? existing.businessDate.toISOString().slice(0, 10);
    const s = await this.prisma.$transaction(async (tx) => {
      await lockStaff(tx, staffId);
      const clash = await findOverlap(tx, staffId, day, start, end, id);
      if (clash) {
        throw new ConflictException(
          `${staff.name} için bu saatlerle çakışan vardiya var (${trDate(clash.businessDate)} ${clash.startTime}–${clash.endTime})`,
        );
      }
      return tx.shift.update({
        where: { id },
        data: {
          staffId: dto.staffId,
          businessDate: dto.businessDate
            ? closingDateValue(dto.businessDate)
            : undefined,
          startTime: dto.startTime,
          endTime: dto.endTime,
          notes:
            dto.notes === undefined ? undefined : dto.notes?.trim() || null,
        },
        include,
      });
    });
    await this.audit.log({
      action: 'shift_updated',
      entityType: 'shift',
      entityId: s.id,
      actorId: user.id,
      details: { ...dto },
    });
    return toDto(s);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ): Promise<DeleteShiftResponseDto> {
    const existing = await this.prisma.shift.findUnique({
      where: { id },
      include,
    });
    if (!existing) throw new NotFoundException('Vardiya bulunamadı');
    await this.prisma.shift.delete({ where: { id } });
    await this.audit.log({
      action: 'shift_deleted',
      entityType: 'shift',
      entityId: id,
      actorId: user.id,
      details: {
        staff: existing.staff.name,
        date: existing.businessDate.toISOString().slice(0, 10),
      },
    });
    return { success: true };
  }
}
