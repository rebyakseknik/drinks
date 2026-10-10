// @ts-nocheck

export interface CreateShiftTemplateDto {
  /**
     * @minLength 1
     * @maxLength 40
     */
  name: string;
  startTime: string;
  endTime: string;
}
