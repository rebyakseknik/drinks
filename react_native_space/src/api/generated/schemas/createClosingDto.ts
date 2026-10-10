// @ts-nocheck

export interface CreateClosingDto {
  businessDate: string;
  /**
     * @minimum 0
     * @maximum 1000000000
     */
  netCashKurus: number;
  /**
     * @minimum 0
     * @maximum 1000000000
     */
  netCardKurus: number;
  notes?: string;
}
