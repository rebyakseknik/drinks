// @ts-nocheck
import type { ShiftStaffDto } from './shiftStaffDto';

export interface ShiftResponseDto {
  id: string;
  /** İş günü (YYYY-MM-DD) */
  businessDate: string;
  startTime: string;
  endTime: string;
  /** Vardiya süresi (dakika). Bitiş başlangıçtan önceyse gece yarısını geçtiği kabul edilir. */
  minutes: number;
  /** @nullable */
  notes: string | null;
  staff: ShiftStaffDto;
}
