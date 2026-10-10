// @ts-nocheck

export interface UpdateShiftDto {
  staffId?: string;
  /** @pattern ^\d{4}-\d{2}-\d{2}$ */
  businessDate?: string;
  startTime?: string;
  endTime?: string;
  /**
     * @maxLength 200
     * @nullable
     */
  notes?: string | null;
}
