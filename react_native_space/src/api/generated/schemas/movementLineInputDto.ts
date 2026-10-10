// @ts-nocheck

export interface MovementLineInputDto {
  productId: string;
  packageName: string;
  /** @minimum 0.001 */
  packageQuantity: number;
  /** @minimum 1 */
  conversionFactorUsed: number;
  notes?: string;
  reason?: string;
}
