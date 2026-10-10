import { IsInt, IsOptional, IsString, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClosingDto {
  @IsDateString() businessDate: string;
  @IsInt() @Min(0) @Max(1_000_000_000) netCashKurus: number;
  @IsInt() @Min(0) @Max(1_000_000_000) netCardKurus: number;
  @IsString() @IsOptional() notes?: string;
}

export class UpdateClosingDto {
  @IsInt() @IsOptional() @Min(0) @Max(1_000_000_000) netCashKurus?: number;
  @IsInt() @IsOptional() @Min(0) @Max(1_000_000_000) netCardKurus?: number;
  @IsString() @IsOptional() notes?: string;
  @IsInt() version: number;
}

export class ClosingCreatorDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
}

export class ClosingResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() businessDate: Date;
  @ApiProperty() netCashKurus: number;
  @ApiProperty() netCardKurus: number;
  @ApiProperty() totalRevenueKurus: number;
  @ApiProperty({ nullable: true }) notes: string | null;
  @ApiProperty() version: number;
  @ApiProperty({ nullable: true, type: () => ClosingCreatorDto }) createdBy: ClosingCreatorDto | null;
  @ApiProperty({ nullable: true, type: () => ClosingCreatorDto }) updatedBy: ClosingCreatorDto | null;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class ClosingListResponseDto {
  @ApiProperty({ type: () => [ClosingResponseDto] }) items: ClosingResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}

export class TodayClosingResponseDto {
  @ApiProperty({ nullable: true, type: () => ClosingResponseDto }) closing: ClosingResponseDto | null;
}

export class ClosingSummaryResponseDto {
  @ApiProperty() totalRevenueKurus: number;
  @ApiProperty() totalCashKurus: number;
  @ApiProperty() totalCardKurus: number;
  @ApiProperty() daysRecorded: number;
  @ApiProperty() daysInPeriod: number;
}

export class ClosingComparisonItemDto {
  @ApiProperty() date: Date;
  @ApiProperty() totalRevenueKurus: number;
}

export class ClosingComparisonResponseDto {
  @ApiProperty({ nullable: true, type: () => ClosingComparisonItemDto }) today: ClosingComparisonItemDto | null;
  @ApiProperty({ nullable: true, type: () => ClosingComparisonItemDto }) lastWeek: ClosingComparisonItemDto | null;
  @ApiProperty({ nullable: true }) changePercent: number | null;
}
