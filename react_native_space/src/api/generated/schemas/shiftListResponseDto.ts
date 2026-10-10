// @ts-nocheck
import type { ShiftResponseDto } from './shiftResponseDto';
import type { ShiftStaffTotalDto } from './shiftStaffTotalDto';

export interface ShiftListResponseDto {
  items: ShiftResponseDto[];
  totals: ShiftStaffTotalDto[];
}
