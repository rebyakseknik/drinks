import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/prisma-exception.filter';

/** Uygulama ve testler aynı ayarlarla çalışsın diye tek yerde tanımlanır. */
export function configureApp(app: INestApplication) {
  app.enableCors({ origin: '*' });
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
}
