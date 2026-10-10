/**
 * Format kuruş integer to Turkish currency string: "1.234,56 ₺"
 */
export function formatMoney(kurus: number | null | undefined): string {
  if (kurus == null) return '0,00 ₺';
  const lira = kurus / 100;
  const parts = lira.toFixed(2).split('.');
  const intPart = parts[0] ?? '0';
  const decPart = parts[1] ?? '00';
  const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${withDots},${decPart} ₺`;
}

/**
 * Parse Turkish money input ("1.234,56" or "1234.56") to kuruş integer
 */
export function parseMoneyInput(text: string): number {
  if (!text) return 0;
  // Remove dots (thousands sep), replace comma with dot
  const cleaned = text.replace(/\./g, '').replace(',', '.');
  const val = parseFloat(cleaned);
  if (isNaN(val)) return 0;
  return Math.round(val * 100);
}

/**
 * Format date to dd.MM.yyyy
 */
export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${day}.${month}.${year}`;
}

export function formatDateTime(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return `${formatDate(dateStr)} ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

const WEEKDAYS_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
export function getWeekdayName(dateStr: string | Date): string {
  const d = new Date(dateStr);
  return WEEKDAYS_TR[d.getUTCDay()] ?? '';
}

const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
export function getMonthName(month: number): string {
  return MONTHS_TR[month] ?? '';
}

export function getMovementTypeLabel(type: string): string {
  const map: Record<string, string> = {
    mal_kabul: 'Mal Kabul',
    sevkiyat: 'Sevkiyat',
    depoya_iade: 'Depoya İade',
    fire_hasar: 'Fire/Hasar',
    sayim_duzeltmesi: 'Sayım Düzeltmesi',
  };
  return map[type] ?? type;
}

export function getBaseUnitLabel(unit: string): string {
  const map: Record<string, string> = { adet: 'adet', gram: 'g', mililitre: 'ml' };
  return map[unit] ?? unit;
}

export function getRoleLabel(role: string): string {
  return role === 'owner' ? 'Sahip' : 'Yönetici';
}
