// @ts-nocheck

export interface MovementLineInputDto {
  productId: string;
  /** @maxLength 50 */
  packageName: string;
  /** Paket cinsinden miktar. Yalnızca sayım düzeltmesinde eksi olabilir (stok azaltma). */
  packageQuantity: number;
  /** @minimum 1 */
  conversionFactorUsed: number;
  /** @maxLength 500 */
  notes?: string;
  /** @maxLength 500 */
  reason?: string;
  /** Sayım düzeltmesinde kullanıcının ekranda gördüğü sistem stoğu (temel birim).
   * Gönderilirse ve kayıt anındaki stok farklıysa işlem yapılmaz (409, code: STOCK_CHANGED). */
  expectedStock?: number;
}
