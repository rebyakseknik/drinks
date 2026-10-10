import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() category: string;
  @IsEnum(['adet', 'gram', 'mililitre']) baseUnit: string;
  @IsInt() @IsOptional() @Min(0) minStockThreshold?: number;
}

export class UpdateProductDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() category?: string;
  @IsInt() @IsOptional() @Min(0) minStockThreshold?: number;
  @IsBoolean() @IsOptional() active?: boolean;
}

export class CreateConversionDto {
  @IsString() @IsNotEmpty() packageName: string;
  @IsInt() @Min(1) conversionFactor: number;
  @IsDateString() effectiveFrom: string;
}

export class UpdateConversionDto {
  @IsString() @IsOptional() packageName?: string;
  @IsInt() @IsOptional() @Min(1) conversionFactor?: number;
  @IsDateString() @IsOptional() effectiveFrom?: string;
  @IsBoolean() @IsOptional() active?: boolean;
}

export class SetInitialStockDto {
  @IsInt() @Min(0) count: number;
  @IsDateString() date: string;
}

export class ConversionResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() productId: string;
  @ApiProperty() packageName: string;
  @ApiProperty() conversionFactor: number;
  @ApiProperty() effectiveFrom: Date;
  @ApiProperty() active: boolean;
}

export class InitialStockInfoDto {
  @ApiProperty() count: number;
  @ApiProperty() date: Date;
}

export class ProductResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() category: string;
  @ApiProperty() baseUnit: string;
  @ApiProperty() active: boolean;
  @ApiProperty() minStockThreshold: number;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiProperty({ nullable: true }) createdById: string | null;
}

export class ProductDetailResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() category: string;
  @ApiProperty() baseUnit: string;
  @ApiProperty() active: boolean;
  @ApiProperty() minStockThreshold: number;
  @ApiProperty({ nullable: true, type: () => InitialStockInfoDto }) initialStock: InitialStockInfoDto | null;
  @ApiProperty({ type: () => [ConversionResponseDto] }) conversions: ConversionResponseDto[];
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiProperty({ nullable: true }) createdById: string | null;
}

export class ProductListResponseDto {
  @ApiProperty({ type: () => [ProductResponseDto] }) items: ProductResponseDto[];
}

export class ConversionListResponseDto {
  @ApiProperty({ type: () => [ConversionResponseDto] }) items: ConversionResponseDto[];
}

export class InitialStockResponseDto {
  @ApiProperty() productId: string;
  @ApiProperty() initialCount: number;
  @ApiProperty() initialDate: Date;
}
