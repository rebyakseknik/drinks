// @ts-nocheck

export interface CreateConversionDto {
  packageName: string;
  /** @minimum 1 */
  conversionFactor: number;
  effectiveFrom: string;
}
