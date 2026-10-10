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
 * Para girişini kuruşa çevirir. Desteklenen yazımlar:
 *   "1.234,56" · "1234,56" · "1234.56" · "12.5" · "1.234" (binlik) · "1234"
 * Virgül varsa ondalık ayırıcı virgüldür ve noktalar binlik ayırıcıdır.
 * Virgül yoksa tek bir noktadan sonra 1–2 hane varsa nokta ondalık sayılır.
 */
export function parseMoneyInput(text: string): number {
  if (!text) return 0;
  let t = text.replace(/[\s₺]/g, '');
  if (t.includes(',')) {
    t = t.replace(/\./g, '').replace(',', '.');
  } else if (/^\d+\.\d{1,2}$/.test(t)) {
    // "12.5" / "1234.56" → ondalık nokta
  } else {
    t = t.replace(/\./g, '');
  }
  const val = Number(t);
  if (!Number.isFinite(val) || val < 0) return 0;
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

/**
 * Gerçek zaman damgası (hareket, kayıt saati) → İstanbul saatiyle "dd.MM.yyyy HH:mm".
 * Not: formatDate gün olarak saklanan değerler (kapanış günü) içindir; zaman damgası için
 * formatMoment / formatDateTime kullanın, yoksa gece 00:00–03:00 arası önceki güne düşer.
 */
const IST_OFFSET_MS = 3 * 60 * 60 * 1000;
export function formatMoment(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(new Date(dateStr).getTime() + IST_OFFSET_MS);
  if (isNaN(d.getTime())) return '';
  return formatDate(d);
}
export function formatDateTime(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return '';
  const d = new Date(new Date(dateStr).getTime() + IST_OFFSET_MS);
  if (isNaN(d.getTime())) return '';
  return `${formatDate(d)} ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
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

/**
 * Miktar girişini sayıya çevirir ("1,5" veya "1.5"). Geçersizse null.
 */
export function parseQuantityInput(text: string): number | null {
  if (!text || !text.trim()) return null;
  const val = Number(text.trim().replace(',', '.'));
  return Number.isFinite(val) ? val : null;
}

/** Miktarı Türkçe biçimde gösterir: 1234.5 → "1.234,5" */
export function formatQuantity(n: number): string {
  return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 3 }).format(n);
}

/** İstanbul saatine göre bugünün tarihi: 'YYYY-MM-DD' (Türkiye sabit UTC+3). */
export function istanbulToday(): string {
  return new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** 'YYYY-MM-DD' gününe n gün ekler. */
export function addDaysToDay(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
