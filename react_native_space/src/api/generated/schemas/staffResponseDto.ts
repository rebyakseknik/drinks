// @ts-nocheck
import type { StaffResponseDtoWagePeriod } from './staffResponseDtoWagePeriod';

export interface StaffResponseDto {
  id: string;
  name: string;
  /** @nullable */
  phone: string | null;
  wagePeriod: StaffResponseDtoWagePeriod;
  /** @nullable */
  wageKurus: number | null;
  active: boolean;
  createdAt: string;
}
