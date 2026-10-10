import { Injectable, ConflictException, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto, ChangePasswordDto } from './dto/auth.dto';
import { AuditService } from '../audit/audit.service';
import { UserRole } from '@prisma/client';
import { REAL_USER_FILTER } from './system-account';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  private generateToken(user: { id: string; email: string; role: string }) {
    return this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
  }

  async signup(dto: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new ConflictException('Bu e-posta adresi zaten kayıtlı');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Transaction-scoped advisory lock: serializes signups so two people cannot both become owner
    // and an invite code cannot be used twice.
    const { user, role } = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe('SELECT pg_advisory_xact_lock(424242)');

      const userCount = await tx.user.count({ where: REAL_USER_FILTER });
      let role: UserRole = UserRole.manager;
      let inviteId: string | null = null;

      if (userCount === 0) {
        role = UserRole.owner;
      } else if (dto.inviteCode) {
        const invite = await tx.inviteCode.findUnique({ where: { code: dto.inviteCode.trim().toUpperCase() } });
        if (!invite || !invite.isActive || invite.expiresAt < new Date() || invite.usedById) {
          throw new BadRequestException('Geçersiz veya süresi dolmuş davet kodu');
        }
        inviteId = invite.id;
      } else {
        throw new ForbiddenException('Kayıt olmak için davet kodu gereklidir');
      }

      const user = await tx.user.create({
        data: { email: dto.email, password: hashedPassword, name: dto.name, role },
      });

      if (inviteId) {
        await tx.inviteCode.update({
          where: { id: inviteId },
          data: { usedById: user.id, usedAt: new Date(), isActive: false },
        });
      }
      return { user, role };
    });

    await this.auditService.log({
      action: 'user_registered',
      entityType: 'User',
      entityId: user.id,
      actorId: user.id,
      details: { role },
    });

    const token = this.generateToken(user);
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Geçersiz e-posta veya şifre');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Geçersiz e-posta veya şifre');

    const token = this.generateToken(user);
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı');
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt } };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('Kullanıcı bulunamadı');

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw new BadRequestException('Mevcut şifre hatalı');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });

    await this.auditService.log({
      action: 'password_changed',
      entityType: 'User',
      entityId: userId,
      actorId: userId,
    });

    return { success: true };
  }
}
