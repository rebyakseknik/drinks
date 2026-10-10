import { Module } from '@nestjs/common';
import { ShiftsController } from './shifts.controller';
import { ShiftTemplatesController } from './shift-templates.controller';

@Module({ controllers: [ShiftsController, ShiftTemplatesController] })
export class ShiftsModule {}
