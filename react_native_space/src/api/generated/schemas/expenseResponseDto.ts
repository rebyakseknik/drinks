// @ts-nocheck
import type { ExpenseResponseDtoCategory } from './expenseResponseDtoCategory';
import type { ExpenseStaffDto } from './expenseStaffDto';

export interface ExpenseResponseDto {
  id: string;
  /** Gider günü (YYYY-MM-DD) */
  expenseDate: string;
  category: ExpenseResponseDtoCategory;
  amountKurus: number;
  /** @nullable */
  description: string | null;
  /** @nullable */
  staff: ExpenseStaffDto | null;
  /** @nullable */
  createdByName: string | null;
  createdAt: string;
}
