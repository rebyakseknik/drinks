import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsNumber,
  IsInt,
  IsUUID,
  Min,
  NotEquals,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MovementLineInputDto {
  @IsUUID() productId: string;
  @IsString() @IsNotEmpty() @MaxLength(50) packageName: string;
  /** Paket cinsinden miktar. Yalnızca sayım düzeltmesinde eksi olabilir (stok azaltma). */
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @NotEquals(0)
  packageQuantity: number;
  @IsInt() @Min(1) conversionFactorUsed: number;
  @IsString() @IsOptional() @MaxLength(500) notes?: string;
  @IsString() @IsOptional() @MaxLength(500) reason?: string;
  /**
   * Sayım düzeltmesinde kullanıcının ekranda gördüğü sistem stoğu (temel birim).
   * Gönderilirse ve kayıt anındaki stok farklıysa işlem yapılmaz (409, code: STOCK_CHANGED).
   */
  @IsInt() @IsOptional() expectedStock?: number;
}

export class CreateMovementDto {
  @IsUUID() idempotencyKey: string;
  @IsDateString() documentDate: string;
  @IsEnum([
    'mal_kabul',
    'sevkiyat',
    'depoya_iade',
    'fire_hasar',
    'sayim_duzeltmesi',
  ])
  type: string;
  @IsString() @IsOptional() @MaxLength(1000) notes?: string;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => MovementLineInputDto)
  lines: MovementLineInputDto[];
}

export class ReverseMovementDto {
  @IsString() @IsOptional() notes?: string;
}

export class MovementLineCreatorDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
}

export class MovementLineResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() productId: string;
  @ApiProperty() productName: string;
  @ApiProperty() quantity: number;
  @ApiProperty() packageName: string;
  @ApiProperty() packageQuantity: number;
  @ApiProperty() conversionFactorUsed: number;
  @ApiProperty({ nullable: true }) notes: string | null;
  @ApiProperty({ nullable: true }) reason: string | null;
}

export class MovementDocumentResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() documentDate: Date;
  @ApiProperty() type: string;
  @ApiProperty({ nullable: true }) notes: string | null;
  @ApiProperty() status: string;
  @ApiProperty({ nullable: true }) reversalOfId: string | null;
  @ApiProperty({ nullable: true, type: () => MovementLineCreatorDto })
  createdBy: MovementLineCreatorDto | null;
  @ApiProperty() createdAt: Date;
  @ApiProperty({ type: () => [MovementLineResponseDto] })
  lines: MovementLineResponseDto[];
}

export class MovementListResponseDto {
  @ApiProperty({ type: () => [MovementDocumentResponseDto] })
  items: MovementDocumentResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}

export class ReverseMovementResponseDto {
  @ApiProperty({ type: () => MovementDocumentResponseDto })
  reversalDocument: MovementDocumentResponseDto;
}
