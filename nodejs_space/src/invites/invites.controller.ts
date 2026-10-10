import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuditService } from '../audit/audit.service';
import { InviteListResponseDto, InviteCreatedResponseDto, InviteDeleteResponseDto } from './dto/invite.dto';

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

@Controller('api/invites')
@UseGuards(JwtAuthGuard, OwnerGuard)
export class InvitesController {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  @Post()
  async create(@CurrentUser() user: { id: string }): Promise<InviteCreatedResponseDto> {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invite = await this.prisma.inviteCode.create({
      data: { code, createdById: user.id, expiresAt },
    });

    await this.auditService.log({
      action: 'invite_generated',
      entityType: 'InviteCode',
      entityId: invite.id,
      actorId: user.id,
      details: { code },
    });

    return { id: invite.id, code: invite.code, createdAt: invite.createdAt, expiresAt: invite.expiresAt };
  }

  @Get()
  async findAll(): Promise<InviteListResponseDto> {
    const invites = await this.prisma.inviteCode.findMany({
      orderBy: { createdAt: 'desc' },
      include: { usedBy: { select: { id: true, name: true } } },
    });

    return {
      items: invites.map((i) => ({
        id: i.id,
        code: i.code,
        createdAt: i.createdAt,
        expiresAt: i.expiresAt,
        usedBy: i.usedBy ? { id: i.usedBy.id, name: i.usedBy.name } : null,
        isActive: i.isActive,
      })),
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ): Promise<InviteDeleteResponseDto> {
    await this.prisma.inviteCode.update({
      where: { id },
      data: { isActive: false },
    });

    await this.auditService.log({
      action: 'invite_revoked',
      entityType: 'InviteCode',
      entityId: id,
      actorId: user.id,
    });

    return { success: true };
  }
}
