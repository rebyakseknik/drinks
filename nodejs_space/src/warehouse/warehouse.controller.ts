import { Controller, Get, Query, UseGuards, ParseBoolPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WarehouseStockListDto } from './dto/warehouse.dto';
import { MovementStatus } from '@prisma/client';

@Controller('api/warehouse-stock')
@UseGuards(JwtAuthGuard)
export class WarehouseController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getStock(
    @Query('search') search?: string,
    @Query('belowThreshold', new ParseBoolPipe({ optional: true })) belowThreshold?: boolean,
  ): Promise<WarehouseStockListDto> {
    const where: Record<string, unknown> = { active: true };
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const now = new Date();
    const products = await this.prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        conversions: {
          where: { active: true, effectiveFrom: { lte: now } },
          orderBy: { effectiveFrom: 'desc' },
        },
      },
    });

    // Get movement sums per product
    const movementSums = await this.prisma.movementLine.groupBy({
      by: ['productId'],
      where: { document: { status: MovementStatus.active } },
      _sum: { quantity: true },
    });
    const sumMap = new Map(movementSums.map((m) => [m.productId, m._sum.quantity ?? 0]));

    let items = products.map((p) => {
      const currentStock = (p.initialCount ?? 0) + (sumMap.get(p.id) ?? 0);
      // Her paket adının en güncel tanımı; aralarından en büyük katsayılı olan gösterimde kullanılır
      const latest = new Map<string, { name: string; factor: number }>();
      for (const c of p.conversions) {
        const k = c.packageName.toLocaleLowerCase('tr');
        if (!latest.has(k)) latest.set(k, { name: c.packageName, factor: c.conversionFactor });
      }
      const pkg = [...latest.values()].sort((a, b) => b.factor - a.factor)[0] ?? null;
      return {
        productId: p.id,
        productName: p.name,
        category: p.category,
        baseUnit: p.baseUnit,
        currentStock,
        minStockThreshold: p.minStockThreshold,
        // Başlangıç sayımı girilmemiş üründe stok bilinmez; düşük stok uyarısı verilmez,
        // ekranda "Başlangıç stoğu girilmedi" gösterilir.
        isBelowThreshold: p.initialCount !== null && currentStock < p.minStockThreshold,
        hasInitialStock: p.initialCount !== null,
        packageName: pkg && pkg.factor > 1 ? pkg.name : null,
        packageFactor: pkg && pkg.factor > 1 ? pkg.factor : null,
      };
    });

    if (belowThreshold) {
      items = items.filter((i) => i.isBelowThreshold);
    }

    return { items };
  }
}
