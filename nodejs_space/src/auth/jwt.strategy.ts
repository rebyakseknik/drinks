import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { isLegacySystemEmail } from './legacy-accounts';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  /**
   * Her istekte kullanıcı veritabanından okunur:
   *  - silinen kullanıcının oturumu anında geçersiz olur,
   *  - rol değişikliği (sahip ↔ yönetici) bir sonraki istekte geçerli olur.
   */
  async validate(payload: { sub: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true },
    });
    if (!user)
      throw new UnauthorizedException(
        'Oturum geçersiz. Lütfen tekrar giriş yapın.',
      );
    return { id: user.id, email: user.email, role: user.role };
  }
}
