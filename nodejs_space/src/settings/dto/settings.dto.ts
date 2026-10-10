import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBusinessSettingsDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() location?: string;
}

export class BusinessSettingsResponseDto {
  @ApiProperty() name: string;
  @ApiProperty() location: string;
}
