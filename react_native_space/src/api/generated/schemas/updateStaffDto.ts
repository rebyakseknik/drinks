// @ts-nocheck
import type { UpdateStaffDtoWagePeriod } from './updateStaffDtoWagePeriod';

export interface UpdateStaffDto {
  /**
     * @minLength 1
     * @maxLength 80
     */
  name?: string;
  /**
     * @maxLength 30
     * @nullable
     */
  phone?: string | null;
  wagePeriod?: UpdateStaffDtoWagePeriod;
  /**
     * @minimum 0
     * @maximum 1000000000
     * @nullable
     */
  wageKurus?: number | null;
  active?: boolean;
}
