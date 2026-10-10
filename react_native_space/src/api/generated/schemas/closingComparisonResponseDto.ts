// @ts-nocheck
import type { ClosingComparisonItemDto } from './closingComparisonItemDto';

export interface ClosingComparisonResponseDto {
  /** @nullable */
  today: ClosingComparisonItemDto | null;
  /** @nullable */
  lastWeek: ClosingComparisonItemDto | null;
  /** @nullable */
  changePercent: number | null;
}
