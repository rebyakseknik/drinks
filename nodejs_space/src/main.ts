import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  const swaggerPath = 'api-docs';

  // No-cache for swagger
  app.use(`/${swaggerPath}`, (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  const config = new DocumentBuilder()
    .setTitle('Drinks Y\u00f6netim API')
    .setDescription('\u0130\u00e7ecek i\u015fletmesi y\u00f6netim API\'si')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document, {
    customSiteTitle: 'Drinks Y\u00f6netim API',
    customCss: `
      .topbar { display: none; }
      .swagger-ui .info .title { color: #6B21A8; }
      body { background: #f8f9fa; }
    `,
    swaggerOptions: { layout: 'BaseLayout' },
  });

  // Barındırma servisleri portu PORT değişkeniyle verir; yoksa 3000
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
