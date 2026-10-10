import { Controller, Get, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import type { Response } from 'express';
import { Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MovementStatus, MovementType } from '@prisma/client';
import { RevenueReportDto, DispatchReportDto, TopDispatchedReportDto } from './dto/report.dto';

@Controller('api/reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private prisma: PrismaService) {}

  @Get('revenue')
  async revenue(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Promise<RevenueReportDto> {
    const closings = await this.prisma.dailyClosing.findMany({
      where: {
        businessDate: { gte: new Date(from), lte: new Date(to) },
      },
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
    const docs = await this.prisma.movementDocument.findMany({
      where: {
        type: MovementType.sevkiyat,
        status: MovementStatus.active,
        documentDate: { gte: new Date(from), lte: new Date(to) },
      },
      include: {
        createdBy: { select: { name: true } },
        lines: { include: { product: { select: { name: true, baseUnit: true } } } },
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
    const lines = await this.prisma.movementLine.findMany({
      where: {
        document: {
          type: MovementType.sevkiyat,
          status: MovementStatus.active,
          documentDate: { gte: new Date(from), lte: new Date(to) },
        },
      },
      include: { product: { select: { id: true, name: true, baseUnit: true } } },
    });

    const map = new Map<string, { productId: string; productName: string; baseUnit: string; total: number }>();
    for (const l of lines) {
      const key = l.productId;
      const existing = map.get(key);
      if (existing) {
        existing.total += Math.abs(l.quantity);
      } else {
        map.set(key, {
          productId: l.productId,
          productName: l.product?.name ?? '',
          baseUnit: l.product?.baseUnit ?? '',
          total: Math.abs(l.quantity),
        });
      }
    }

    const sorted = Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, limit ?? 10);

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
    let csv = '';
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (type === 'revenue') {
      const closings = await this.prisma.dailyClosing.findMany({
        where: { businessDate: { gte: fromDate, lte: toDate } },
        orderBy: { businessDate: 'asc' },
      });
      csv = 'Tarih;Nakit (TL);Kart (TL);Toplam (TL)\n';
      for (const c of closings) {
        const d = c.businessDate.toISOString().split('T')[0];
        csv += `${d};${(c.netCashKurus / 100).toFixed(2).replace('.', ',')};${(c.netCardKurus / 100).toFixed(2).replace('.', ',')};${(c.totalRevenueKurus / 100).toFixed(2).replace('.', ',')}\n`;
      }
    } else if (type === 'movements') {
      const docs = await this.prisma.movementDocument.findMany({
        where: { documentDate: { gte: fromDate, lte: toDate }, status: MovementStatus.active },
        include: {
          lines: { include: { product: { select: { name: true, baseUnit: true } } } },
          createdBy: { select: { name: true } },
        },
        orderBy: { documentDate: 'desc' },
      });
      csv = 'Tarih;T\u00fcr;\u00dcr\u00fcn;Miktar;Birim;Olu\u015fturan\n';
      for (const d of docs) {
        for (const l of d.lines) {
          csv += `${d.documentDate.toISOString().split('T')[0]};${d.type};${l.product?.name ?? ''};${l.quantity};${l.product?.baseUnit ?? ''};${d.createdBy?.name ?? ''}\n`;
        }
      }
    } else if (type === 'dispatches') {
      const docs = await this.prisma.movementDocument.findMany({
        where: {
          type: MovementType.sevkiyat,
          status: MovementStatus.active,
          documentDate: { gte: fromDate, lte: toDate },
        },
        include: {
          lines: { include: { product: { select: { name: true, baseUnit: true } } } },
          createdBy: { select: { name: true } },
        },
        orderBy: { documentDate: 'desc' },
      });
      csv = 'Tarih;\u00dcr\u00fcn;Miktar;Birim;Olu\u015fturan\n';
      for (const d of docs) {
        for (const l of d.lines) {
          csv += `${d.documentDate.toISOString().split('T')[0]};${l.product?.name ?? ''};${Math.abs(l.quantity)};${l.product?.baseUnit ?? ''};${d.createdBy?.name ?? ''}\n`;
        }
      }
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="rapor-${type}.csv"`);
    res.send('\uFEFF' + csv); // BOM for Excel
  }
}
