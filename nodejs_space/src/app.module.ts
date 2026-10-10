import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { MovementsModule } from './movements/movements.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { ClosingsModule } from './closings/closings.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { UsersModule } from './users/users.module';
import { InvitesModule } from './invites/invites.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuditModule,
    AuthModule,
    ProductsModule,
    MovementsModule,
    WarehouseModule,
    ClosingsModule,
    ReportsModule,
    SettingsModule,
    UsersModule,
    InvitesModule,
  ],
})
export class AppModule {}
