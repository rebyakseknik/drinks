import { Controller, Get, Put, Delete, Param, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OwnerGuard } from '../auth/owner.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuditService } from '../audit/audit.service';
import { UpdateUserRoleDto, UserListResponseDto, UserRoleResponseDto, DeleteResponseDto } from './dto/user.dto';
import { UserRole } from '@prisma/client';
import { REAL_USER_FILTER } from '../auth/system-account';

@Controller('api/users')
@UseGuards(JwtAuthGuard, OwnerGuard)
export class UsersController {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  @Get()
  async findAll(): Promise<UserListResponseDto> {
    const users = await this.prisma.user.findMany({ where: REAL_USER_FILTER, orderBy: { createdAt: 'asc' } });
    return {
      items: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      })),
    };
  }

  @Put(':id/role')
  async updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() user: { id: string },
  ): Promise<UserRoleResponseDto> {
    if (id === user.id) throw new ForbiddenException('Kendi rol\u00fcn\u00fcz\u00fc de\u011fi\u015ftiremezsiniz');

    const updated = await this.prisma.user.update({
      where: { id },
      data: { role: dto.role as UserRole },
    });

    await this.auditService.log({
      action: 'user_role_changed',
      entityType: 'User',
      entityId: id,
      actorId: user.id,
      details: { newRole: dto.role },
    });

    return { id: updated.id, name: updated.name, email: updated.email, role: updated.role };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ): Promise<DeleteResponseDto> {
    if (id === user.id) throw new ForbiddenException('Kendinizi silemezsiniz');

    // Check not last owner
    const target = await this.prisma.user.findUnique({ where: { id } });
    if (target?.role === 'owner') {
      const ownerCount = await this.prisma.user.count({ where: { role: 'owner', ...REAL_USER_FILTER } });
      if (ownerCount <= 1) throw new ForbiddenException('Son sahip silinemez');
    }

    await this.prisma.user.delete({ where: { id } });

    await this.auditService.log({
      action: 'user_deleted',
      entityType: 'User',
      entityId: id,
      actorId: user.id,
    });

    return { success: true };
  }
}
