import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    action: string;
    entityType: string;
    entityId: string;
    actorId?: string;
    details?: Record<string, unknown>;
  }) {
    await this.prisma.auditLog.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        actorId: params.actorId ?? null,
        details: params.details ? JSON.stringify(params.details) : null,
      },
    });
  }
}
