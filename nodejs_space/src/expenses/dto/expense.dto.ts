import {
  IsUUID,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const EXPENSE_CATEGORIES = [
  'personel_maasi',
  'kira',
  'fatura',
  'malzeme',
  'diger',
] as const;
export type ExpenseCategoryValue = (typeof EXPENSE_CATEGORIES)[number];
const DAY = /^\d{4}-\d{2}-\d{2}$/;

export class CreateExpenseDto {
  @IsString()
  @Matches(DAY, { message: 'Tarih YYYY-AA-GG olmalı' })
  expenseDate: string;
  @IsIn(EXPENSE_CATEGORIES as unknown as string[])
  category: ExpenseCategoryValue;
  @IsInt() @Min(1) @Max(1_000_000_000) amountKurus: number;
  @IsString() @IsOptional() staffId?: string;
  @IsString() @IsOptional() @MaxLength(200) description?: string;
  /** Çift kayıt koruması: aynı anahtarla tekrar gönderilen gider ikinci kez kaydedilmez. */
  @IsUUID() @IsOptional() idempotencyKey?: string;
}

export class ExpenseStaffDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
}

export class ExpenseResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ description: 'Gider günü (YYYY-MM-DD)' }) expenseDate: string;
  @ApiProperty({ enum: EXPENSE_CATEGORIES }) category: ExpenseCategoryValue;
  @ApiProperty() amountKurus: number;
  @ApiProperty({ nullable: true }) description: string | null;
  @ApiProperty({ nullable: true, type: () => ExpenseStaffDto })
  staff: ExpenseStaffDto | null;
  @ApiProperty({ nullable: true }) createdByName: string | null;
  @ApiProperty() createdAt: Date;
}

export class ExpenseListResponseDto {
  @ApiProperty({ type: () => [ExpenseResponseDto] })
  items: ExpenseResponseDto[];
}

export class ExpenseCategoryTotalDto {
  @ApiProperty({ enum: EXPENSE_CATEGORIES }) category: ExpenseCategoryValue;
  @ApiProperty() totalKurus: number;
}

export class ExpenseSummaryResponseDto {
  @ApiProperty() totalExpenseKurus: number;
  @ApiProperty({ type: () => [ExpenseCategoryTotalDto] })
  byCategory: ExpenseCategoryTotalDto[];
  @ApiProperty({
    description: 'Aynı dönemde girilen kapanışların ciro toplamı',
  })
  revenueKurus: number;
  @ApiProperty({ description: 'Kapanış girilmiş gün sayısı' })
  closingDays: number;
  @ApiProperty({
    description: 'Dönemin bugüne kadarki gün sayısı (ileri tarihler sayılmaz)',
  })
  daysInPeriod: number;
  @ApiProperty({ description: 'Ciro - gider' }) netKurus: number;
}

export class DeleteExpenseResponseDto {
  @ApiProperty() success: boolean;
}
