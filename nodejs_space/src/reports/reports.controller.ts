import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { MovementStatus, MovementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  RevenueReportDto,
  DispatchReportDto,
  TopDispatchedReportDto,
} from './dto/report.dto';
import {
  closingDateValue,
  istanbulDay,
  istanbulDayStart,
  nextDay,
  parseDayRange,
} from '../common/dates';

const TYPE_LABELS: Record<string, string> = {
  mal_kabul: 'Mal Kabul',
  sevkiyat: 'Sevkiyat',
  depoya_iade: 'Depoya İade',
  fire_hasar: 'Fire/Hasar',
  sayim_duzeltmesi: 'Sayım Düzeltmesi',
};

/** from/to günlerini doğrular. Hatalı girdide 400 döner. */
function range(from?: string, to?: string) {
  try {
    const { fromDay, toDay } = parseDayRange(from, to);
    return {
      fromDay,
      toDay,
      // Kapanışlar gün olarak saklanır: iki uç dahil
      closingWhere: {
        gte: closingDateValue(fromDay),
        lte: closingDateValue(toDay),
      },
      // Hareketler gerçek zaman damgasıdır: bitiş gününün tamamı dahil (İstanbul saati)
      movementWhere: {
        gte: istanbulDayStart(fromDay),
        lt: istanbulDayStart(nextDay(toDay)),
      },
    };
  } catch (e) {
    throw new BadRequestException(
      e instanceof Error ? e.message : 'Geçersiz tarih aralığı',
    );
  }
}

/** CSV hücresi: ayırıcı/satır sonu temizlenir, Excel formül enjeksiyonu engellenir. */
function cell(v: string | number): string {
  let s = String(v).replace(/[;\r\n]+/g, ' ');
  if (/^[=+\-@\t]/.test(s) && typeof v === 'string') s = `'${s}`;
  return s;
}

function money(kurus: number): string {
  return (kurus / 100).toFixed(2).replace('.', ',');
}

/** İptal edilmiş belgeler ve iptal kayıtları raporlara girmez. */
const ACTIVE_DOC = { status: MovementStatus.active, reversalOfId: null };

@Controller('api/reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private prisma: PrismaService) {}

  @Get('revenue')
  async revenue(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<RevenueReportDto> {
    const r = range(from, to);
    const closings = await this.prisma.dailyClosing.findMany({
      where: { businessDate: r.closingWhere },
      orderBy: { businessDate: 'asc' },
    });

    return {
      items: closings.map((c) => ({
        date: c.businessDate,
        netCashKurus: c.netCashKurus,
        netCardKurus: c.netCardKurus,
        totalRevenueKurus: c.totalRevenueKurus,
      })),
    };
  }

  @Get('dispatches')
  async dispatches(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<DispatchReportDto> {
    const r = range(from, to);
    const docs = await this.prisma.movementDocument.findMany({
      where: {
        type: MovementType.sevkiyat,
        ...ACTIVE_DOC,
        documentDate: r.movementWhere,
      },
      include: {
        createdBy: { select: { name: true } },
        lines: {
          include: { product: { select: { name: true, baseUnit: true } } },
        },
      },
      orderBy: { documentDate: 'desc' },
    });

    return {
      items: docs.map((d) => ({
        documentId: d.id,
        documentDate: d.documentDate,
        createdByName: d.createdBy?.name ?? '',
        lines: d.lines.map((l) => ({
          productName: l.product?.name ?? '',
          quantity: Math.abs(l.quantity),
          baseUnit: l.product?.baseUnit ?? '',
        })),
      })),
    };
  }

  @Get('top-dispatched')
  async topDispatched(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<TopDispatchedReportDto> {
    const r = range(from, to);
    const lines = await this.prisma.movementLine.findMany({
      where: {
        document: {
          type: MovementType.sevkiyat,
          ...ACTIVE_DOC,
          documentDate: r.movementWhere,
        },
      },
      include: {
        product: { select: { id: true, name: true, baseUnit: true } },
      },
    });

    const map = new Map<
      string,
      {
        productId: string;
        productName: string;
        baseUnit: string;
        total: number;
      }
    >();
    for (const l of lines) {
      const existing = map.get(l.productId);
      if (existing) {
        existing.total += Math.abs(l.quantity);
      } else {
        map.set(l.productId, {
          productId: l.productId,
          productName: l.product?.name ?? '',
          baseUnit: l.product?.baseUnit ?? '',
          total: Math.abs(l.quantity),
        });
      }
    }

    const max = Math.min(Math.max(limit ?? 10, 1), 100);
    const sorted = Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, max);

    return {
      items: sorted.map((s) => ({
        productId: s.productId,
        productName: s.productName,
        baseUnit: s.baseUnit,
        totalDispatched: s.total,
      })),
    };
  }

  @Get('export')
  async exportCsv(
    @Query('type') type: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    if (!['revenue', 'movements', 'dispatches'].includes(type)) {
      throw new BadRequestException('Geçersiz rapor türü');
    }
    const r = range(from, to);
    const rows: string[] = [];

    if (type === 'revenue') {
      const closings = await this.prisma.dailyClosing.findMany({
        where: { businessDate: r.closingWhere },
        orderBy: { businessDate: 'asc' },
      });
      const byDay = new Map(
        closings.map((c) => [c.businessDate.toISOString().slice(0, 10), c]),
      );
      rows.push('Tarih;Nakit (TL);Kart (TL);Toplam (TL);Durum');
      // Kapanış girilmeyen günler sıfır değil "Kapanış girilmedi" olarak listelenir
      const today = istanbulDay();
      for (let d = r.fromDay; d <= r.toDay && d <= today; d = nextDay(d)) {
        const c = byDay.get(d);
        rows.push(
          c
            ? [
                d,
                money(c.netCashKurus),
                money(c.netCardKurus),
                money(c.totalRevenueKurus),
                '',
              ].join(';')
            : [d, '', '', '', 'Kapanış girilmedi'].join(';'),
        );
      }
    } else {
      const docs = await this.prisma.movementDocument.findMany({
        where: {
          ...(type === 'dispatches' ? { type: MovementType.sevkiyat } : {}),
          ...ACTIVE_DOC,
          documentDate: r.movementWhere,
        },
        include: {
          lines: {
            include: { product: { select: { name: true, baseUnit: true } } },
          },
          createdBy: { select: { name: true } },
        },
        orderBy: { documentDate: 'desc' },
      });
      rows.push(
        type === 'dispatches'
          ? 'Tarih;Ürün;Miktar;Birim;Oluşturan'
          : 'Tarih;Tür;Ürün;Miktar;Birim;Oluşturan',
      );
      for (const d of docs) {
        for (const l of d.lines) {
          const base = [
            istanbulDay(d.documentDate),
            ...(type === 'dispatches' ? [] : [TYPE_LABELS[d.type] ?? d.type]),
            cell(l.product?.name ?? ''),
            type === 'dispatches' ? Math.abs(l.quantity) : l.quantity,
            l.product?.baseUnit ?? '',
            cell(d.createdBy?.name ?? ''),
          ];
          rows.push(base.join(';'));
        }
      }
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="rapor-${type}-${r.fromDay}-${r.toDay}.csv"`,
    );
    res.send('﻿' + rows.join('\n') + '\n'); // BOM: Excel Türkçe karakterleri doğru açsın
  }
}
