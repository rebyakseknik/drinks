// @ts-nocheck

export interface CopyWeekDto {
  /** @pattern ^\d{4}-\d{2}-\d{2}$ */
  fromWeekStart: string;
  /** @pattern ^\d{4}-\d{2}-\d{2}$ */
  toWeekStart: string;
}
