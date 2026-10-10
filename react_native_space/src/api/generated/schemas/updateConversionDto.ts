// @ts-nocheck

export interface UpdateConversionDto {
  packageName?: string;
  /** @minimum 1 */
  conversionFactor?: number;
  effectiveFrom?: string;
  active?: boolean;
}
