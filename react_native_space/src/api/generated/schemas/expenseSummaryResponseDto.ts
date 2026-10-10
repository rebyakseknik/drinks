// @ts-nocheck
import type { ExpenseCategoryTotalDto } from './expenseCategoryTotalDto';

export interface ExpenseSummaryResponseDto {
  totalExpenseKurus: number;
  byCategory: ExpenseCategoryTotalDto[];
  /** Aynı dönemde girilen kapanışların ciro toplamı */
  revenueKurus: number;
  /** Kapanış girilmiş gün sayısı */
  closingDays: number;
  /** Dönemin bugüne kadarki gün sayısı (ileri tarihler sayılmaz) */
  daysInPeriod: number;
  /** Ciro - gider */
  netKurus: number;
}
