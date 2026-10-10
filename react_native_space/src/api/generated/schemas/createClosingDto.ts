// @ts-nocheck

export interface CreateClosingDto {
  businessDate: string;
  /** @minimum 0 */
  netCashKurus: number;
  /** @minimum 0 */
  netCardKurus: number;
  notes?: string;
}
