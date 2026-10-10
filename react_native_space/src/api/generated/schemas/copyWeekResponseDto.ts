// @ts-nocheck

export interface CopyWeekResponseDto {
  /** Kopyalanan vardiya sayısı */
  created: number;
  /** Çakıştığı veya personel pasif olduğu için atlanan vardiya sayısı */
  skipped: number;
  /** Atlananların kısa açıklaması (en fazla 10) */
  skippedReasons: string[];
}
