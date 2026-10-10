// @ts-nocheck
import type { ClosingResponseDto } from './closingResponseDto';

export interface ClosingListResponseDto {
  items: ClosingResponseDto[];
  total: number;
  page: number;
  totalPages: number;
}
