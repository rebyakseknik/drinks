import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateShiftDto {
  @IsString() @MinLength(1) staffId: string;
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Tarih YYYY-AA-GG olmalı' })
  businessDate: string;
  @Matches(TIME, { message: 'Başlangıç saati SS:DD olmalı' }) startTime: string;
  @Matches(TIME, { message: 'Bitiş saati SS:DD olmalı' }) endTime: string;
  @IsString() @IsOptional() @MaxLength(200) notes?: string;
}

export class UpdateShiftDto {
  @IsString() @IsOptional() staffId?: string;
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Tarih YYYY-AA-GG olmalı' })
  businessDate?: string;
  @IsOptional()
  @Matches(TIME, { message: 'Başlangıç saati SS:DD olmalı' })
  startTime?: string;
  @IsOptional()
  @Matches(TIME, { message: 'Bitiş saati SS:DD olmalı' })
  endTime?: string;
  @IsString() @IsOptional() @MaxLength(200) notes?: string | null;
}

export class ShiftStaffDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
}

export class ShiftResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ description: 'İş günü (YYYY-MM-DD)' }) businessDate: string;
  @ApiProperty() startTime: string;
  @ApiProperty() endTime: string;
  @ApiProperty({
    description:
      'Vardiya süresi (dakika). Bitiş başlangıçtan önceyse gece yarısını geçtiği kabul edilir.',
  })
  minutes: number;
  @ApiProperty({ nullable: true }) notes: string | null;
  @ApiProperty({ type: () => ShiftStaffDto }) staff: ShiftStaffDto;
}

export class ShiftStaffTotalDto {
  @ApiProperty() staffId: string;
  @ApiProperty() name: string;
  @ApiProperty() shiftCount: number;
  @ApiProperty() minutes: number;
}

export class ShiftListResponseDto {
  @ApiProperty({ type: () => [ShiftResponseDto] }) items: ShiftResponseDto[];
  @ApiProperty({ type: () => [ShiftStaffTotalDto] })
  totals: ShiftStaffTotalDto[];
}

export class DeleteShiftResponseDto {
  @ApiProperty() success: boolean;
}

export class CopyWeekDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Tarih YYYY-AA-GG olmalı' })
  fromWeekStart: string;
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Tarih YYYY-AA-GG olmalı' })
  toWeekStart: string;
}

export class CopyWeekResponseDto {
  @ApiProperty({ description: 'Kopyalanan vardiya sayısı' }) created: number;
  @ApiProperty({
    description:
      'Çakıştığı veya personel pasif olduğu için atlanan vardiya sayısı',
  })
  skipped: number;
  @ApiProperty({
    type: [String],
    description: 'Atlananların kısa açıklaması (en fazla 10)',
  })
  skippedReasons: string[];
}

export class CreateShiftTemplateDto {
  @IsString() @MinLength(1) @MaxLength(40) name: string;
  @Matches(TIME, { message: 'Başlangıç saati SS:DD olmalı' }) startTime: string;
  @Matches(TIME, { message: 'Bitiş saati SS:DD olmalı' }) endTime: string;
}

export class UpdateShiftTemplateDto {
  @IsString() @IsOptional() @MinLength(1) @MaxLength(40) name?: string;
  @IsOptional()
  @Matches(TIME, { message: 'Başlangıç saati SS:DD olmalı' })
  startTime?: string;
  @IsOptional()
  @Matches(TIME, { message: 'Bitiş saati SS:DD olmalı' })
  endTime?: string;
}

export class ShiftTemplateResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() startTime: string;
  @ApiProperty() endTime: string;
  @ApiProperty() sortOrder: number;
}

export class ShiftTemplateListResponseDto {
  @ApiProperty({ type: () => [ShiftTemplateResponseDto] })
  items: ShiftTemplateResponseDto[];
}

export class DeleteShiftTemplateResponseDto {
  @ApiProperty() success: boolean;
}
