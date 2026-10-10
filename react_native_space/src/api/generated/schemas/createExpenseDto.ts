// @ts-nocheck
import type { CreateExpenseDtoCategory } from './createExpenseDtoCategory';

export interface CreateExpenseDto {
  expenseDate: string;
  category: CreateExpenseDtoCategory;
  /**
     * @minimum 1
     * @maximum 1000000000
     */
  amountKurus: number;
  staffId?: string;
  /** @maxLength 200 */
  description?: string;
  /** Çift kayıt koruması: aynı anahtarla tekrar gönderilen gider ikinci kez kaydedilmez. */
  idempotencyKey?: string;
}
