import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const WAGE_PERIODS = ['gunluk', 'haftalik', 'aylik'] as const;
export type WagePeriodValue = (typeof WAGE_PERIODS)[number];

export class CreateStaffDto {
  @IsString() @MinLength(1) @MaxLength(80) name: string;
  @IsString() @IsOptional() @MaxLength(30) phone?: string;
  @IsIn(WAGE_PERIODS as unknown as string[]) @IsOptional() wagePeriod?: WagePeriodValue;
  @IsInt() @IsOptional() @Min(0) @Max(1_000_000_000) wageKurus?: number | null;
}

export class UpdateStaffDto {
  @IsString() @IsOptional() @MinLength(1) @MaxLength(80) name?: string;
  @IsString() @IsOptional() @MaxLength(30) phone?: string | null;
  @IsIn(WAGE_PERIODS as unknown as string[]) @IsOptional() wagePeriod?: WagePeriodValue;
  @IsInt() @IsOptional() @Min(0) @Max(1_000_000_000) wageKurus?: number | null;
  @IsBoolean() @IsOptional() active?: boolean;
}

export class StaffResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ nullable: true }) phone: string | null;
  @ApiProperty({ enum: WAGE_PERIODS }) wagePeriod: WagePeriodValue;
  @ApiProperty({ nullable: true }) wageKurus: number | null;
  @ApiProperty() active: boolean;
  @ApiProperty() createdAt: Date;
}

export class StaffListResponseDto {
  @ApiProperty({ type: () => [StaffResponseDto] }) items: StaffResponseDto[];
}
