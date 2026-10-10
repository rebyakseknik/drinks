import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

/** Tarih yardımcılarının "Geçersiz tarih" hatalarını 500 yerine 400 olarak döndürür. */
@Catch(RangeError)
export class DateErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('DateErrorFilter');
  catch(exception: RangeError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    if (exception.message.startsWith('Geçersiz tarih')) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ statusCode: 400, message: exception.message });
      return;
    }
    this.logger.error(exception.stack ?? exception.message);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        statusCode: 500,
        message: 'Beklenmeyen bir sunucu hatası oluştu',
      });
  }
}
