// @ts-nocheck

export interface UpdateClosingDto {
  /** @minimum 0 */
  netCashKurus?: number;
  /** @minimum 0 */
  netCardKurus?: number;
  notes?: string;
  version: number;
}
