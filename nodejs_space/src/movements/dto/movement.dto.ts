import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsArray, ValidateNested, IsNumber, IsInt, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MovementLineInputDto {
  @IsUUID() productId: string;
  @IsString() @IsNotEmpty() packageName: string;
  @IsNumber() @Min(0.001) packageQuantity: number;
  @IsInt() @Min(1) conversionFactorUsed: number;
  @IsString() @IsOptional() notes?: string;
  @IsString() @IsOptional() reason?: string;
}

export class CreateMovementDto {
  @IsUUID() idempotencyKey: string;
  @IsDateString() documentDate: string;
  @IsEnum(['mal_kabul', 'sevkiyat', 'depoya_iade', 'fire_hasar', 'sayim_duzeltmesi']) type: string;
  @IsString() @IsOptional() notes?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => MovementLineInputDto)
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
  @ApiProperty({ nullable: true, type: () => MovementLineCreatorDto }) createdBy: MovementLineCreatorDto | null;
  @ApiProperty() createdAt: Date;
  @ApiProperty({ type: () => [MovementLineResponseDto] }) lines: MovementLineResponseDto[];
}

export class MovementListResponseDto {
  @ApiProperty({ type: () => [MovementDocumentResponseDto] }) items: MovementDocumentResponseDto[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}

export class ReverseMovementResponseDto {
  @ApiProperty({ type: () => MovementDocumentResponseDto }) reversalDocument: MovementDocumentResponseDto;
}
