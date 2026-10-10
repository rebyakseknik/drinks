import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
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
  istanbulDay,
  isValidDay,
  parseDayRange,
} from '../common/dates';
import { Prisma } from '@prisma/client';
import {
  CreateExpenseDto,
  DeleteExpenseResponseDto,
  EXPENSE_CATEGORIES,
  ExpenseCategoryValue,
  ExpenseListResponseDto,
  ExpenseResponseDto,
  ExpenseSummaryResponseDto,
} from './dto/expense.dto';

const include = {
  staff: { select: { id: true, name: true } },
  createdBy: { select: { name: true } },
} as const;

type ExpenseRow = {
  id: string;
  expenseDate: Date;
  category: ExpenseCategoryValue;
  amountKurus: number;
  description: string | null;
  createdAt: Date;
  staff: { id: string; name: string } | null;
  createdBy: { name: string } | null;
};

function toDto(e: ExpenseRow): ExpenseResponseDto {
  return {
    id: e.id,
    expenseDate: e.expenseDate.toISOString().slice(0, 10),
    category: e.category,
    amountKurus: e.amountKurus,
    description: e.description,
    staff: e.staff ? { id: e.staff.id, name: e.staff.name } : null,
    createdByName: e.createdBy?.name ?? null,
    createdAt: e.createdAt,
  };
}

@Controller('api/expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  private range(from?: string, to?: string) {
    try {
      const r = parseDayRange(from, to);
      return {
        ...r,
        where: {
          gte: closingDateValue(r.fromDay),
          lte: closingDateValue(r.toDay),
        },
      };
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
  }

  @Get()
  async findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<ExpenseListResponseDto> {
    const r = this.range(from, to);
    const rows = await this.prisma.expense.findMany({
      where: { expenseDate: r.where },
      include,
      orderBy: [{ expenseDate: 'desc' }, { createdAt: 'desc' }],
    });
    return { items: rows.map(toDto) };
  }

  @Get('summary')
  async summary(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<ExpenseSummaryResponseDto> {
    const r = this.range(from, to);
    const [groups, closings] = await Promise.all([
      this.prisma.expense.groupBy({
        by: ['category'],
        where: { expenseDate: r.where },
        _sum: { amountKurus: true },
      }),
      this.prisma.dailyClosing.aggregate({
        where: { businessDate: r.where },
        _sum: { totalRevenueKurus: true },
        _count: true,
      }),
    ]);
    const byCategory = EXPENSE_CATEGORIES.map((c) => ({
      category: c,
      totalKurus: groups.find((g) => g.category === c)?._sum.amountKurus ?? 0,
    })).filter((c) => c.totalKurus > 0);
    const totalExpenseKurus = byCategory.reduce((a, c) => a + c.totalKurus, 0);
    const revenueKurus = closings._sum.totalRevenueKurus ?? 0;
    // Henüz gelmemiş günler "kapanışı yok" sayılmasın: yalnızca bugüne kadarki günler
    const today = istanbulDay();
    let daysInPeriod = 0;
    for (let d = r.fromDay; d <= r.toDay && d <= today; d = addDays(d, 1))
      daysInPeriod++;
    return {
      totalExpenseKurus,
      byCategory,
      revenueKurus,
      closingDays: closings._count,
      daysInPeriod,
      netKurus: revenueKurus - totalExpenseKurus,
    };
  }

  @Post()
  async create(
    @Body() dto: CreateExpenseDto,
    @CurrentUser() user: { id: string },
  ): Promise<ExpenseResponseDto> {
    if (!isValidDay(dto.expenseDate))
      throw new BadRequestException('Geçersiz tarih');
    if (dto.expenseDate > istanbulDay())
      throw new BadRequestException('İleri tarihli gider girilemez');

    // Çift kayıt koruması: aynı anahtarla daha önce kaydedildiyse o kaydı döndür
    if (dto.idempotencyKey) {
      const existing = await this.prisma.expense.findUnique({
        where: { idempotencyKey: dto.idempotencyKey },
        include,
      });
      if (existing) return toDto(existing);
    }

    let staffId: string | null = null;
    if (dto.category === 'personel_maasi') {
      if (!dto.staffId)
        throw new BadRequestException('Maaş için personel seçin');
      const staff = await this.prisma.staff.findUnique({
        where: { id: dto.staffId },
      });
      if (!staff) throw new BadRequestException('Personel bulunamadı');
      staffId = staff.id;
    }

    let e;
    try {
      e = await this.prisma.expense.create({
        data: {
          expenseDate: closingDateValue(dto.expenseDate),
          category: dto.category,
          amountKurus: dto.amountKurus,
          staffId,
          description: dto.description?.trim() || null,
          createdById: user.id,
          idempotencyKey: dto.idempotencyKey ?? null,
        },
        include,
      });
    } catch (err) {
      // Aynı anahtarla eşzamanlı ikinci istek: kaydedilmiş gideri döndür
      if (
        dto.idempotencyKey &&
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        const again = await this.prisma.expense.findUnique({
          where: { idempotencyKey: dto.idempotencyKey },
          include,
        });
        if (again) return toDto(again);
      }
      throw err;
    }
    await this.audit.log({
      action: 'expense_created',
      entityType: 'expense',
      entityId: e.id,
      actorId: user.id,
      details: {
        category: dto.category,
        amountKurus: dto.amountKurus,
        date: dto.expenseDate,
      },
    });
    return toDto(e);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ): Promise<DeleteExpenseResponseDto> {
    const e = await this.prisma.expense.findUnique({ where: { id } });
    if (!e) throw new NotFoundException('Gider bulunamadı');
    await this.prisma.expense.delete({ where: { id } });
    await this.audit.log({
      action: 'expense_deleted',
      entityType: 'expense',
      entityId: id,
      actorId: user.id,
      details: {
        category: e.category,
        amountKurus: e.amountKurus,
        date: e.expenseDate.toISOString().slice(0, 10),
      },
    });
    return { success: true };
  }
}
