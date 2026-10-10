import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

/**
 * Veritabanı kaynaklı bilinen hataları "Sunucu hatası (500)" yerine anlaşılır Türkçe
 * yanıtlara çevirir. Bilinmeyen hatalar yine 500 olarak döner.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('PrismaExceptionFilter');

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Beklenmeyen bir sunucu hatası oluştu';

    switch (exception.code) {
      case 'P2002': // benzersizlik ihlali
        status = HttpStatus.CONFLICT;
        message = 'Bu kayıt zaten mevcut. Lütfen sayfayı yenileyin.';
        break;
      case 'P2025': // kayıt bulunamadı
        status = HttpStatus.NOT_FOUND;
        message = 'Kayıt bulunamadı';
        break;
      case 'P2003': // ilişkili kayıt hatası
        status = HttpStatus.CONFLICT;
        message =
          'Bu kayıt başka kayıtlarla ilişkili olduğu için işlem yapılamadı';
        break;
      default:
        this.logger.error(exception.message);
    }

    res.status(status).json({ statusCode: status, message });
  }
}
