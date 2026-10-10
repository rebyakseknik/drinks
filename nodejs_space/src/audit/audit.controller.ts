import { Controller, Get, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditLogListDto } from './dto/audit-log.dto';

@Controller('api/audit-log')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<AuditLogListDto> {
    const p = page ?? 1;
    const l = Math.min(limit ?? 20, 100);
    const skip = (p - 1) * l;

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: l,
        orderBy: { createdAt: 'desc' },
        include: { actor: { select: { id: true, name: true } } },
      }),
      this.prisma.auditLog.count(),
    ]);

    return {
      items: items.map((i) => ({
        id: i.id,
        action: i.action,
        entityType: i.entityType,
        entityId: i.entityId,
        actorName: i.actor?.name ?? null,
        actorId: i.actorId,
        details: i.details,
        createdAt: i.createdAt,
      })),
      total,
      page: p,
      totalPages: Math.ceil(total / l),
    };
  }
}
