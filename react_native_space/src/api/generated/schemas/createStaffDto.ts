// @ts-nocheck
import type { CreateStaffDtoWagePeriod } from './createStaffDtoWagePeriod';

export interface CreateStaffDto {
  /**
     * @minLength 1
     * @maxLength 80
     */
  name: string;
  /** @maxLength 30 */
  phone?: string;
  wagePeriod?: CreateStaffDtoWagePeriod;
  /**
     * @minimum 0
     * @maximum 1000000000
     * @nullable
     */
  wageKurus?: number | null;
}
