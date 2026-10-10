/**
 * Tarih yardımcıları — işletme takvimi Europe/Istanbul'dur.
 *
 * İki farklı saklama biçimi vardır:
 *  - Günlük kapanış (DailyClosing.businessDate): İstanbul takvim gününün UTC gece yarısı
 *    (ör. 15 Ocak → 2026-01-15T00:00:00.000Z). Saat bilgisi taşımaz.
 *  - Hareket belgeleri (documentDate): gerçek zaman damgası.
 */
const ISTANBUL_TZ = 'Europe/Istanbul';
const DAY_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** 'YYYY-MM-DD' gerçek bir takvim günü mü? (2026-02-31 → false) */
export function isValidDay(day: string): boolean {
  if (!DAY_ONLY.test(day)) return false;
  const d = new Date(`${day}T00:00:00.000Z`);
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === day;
}

/** Geçersiz günde RangeError fırlatır; denetleyiciler bunu 400'e çevirir. */
export function assertDay(day: string): string {
  if (!isValidDay(day)) throw new RangeError(`Geçersiz tarih: ${day}`);
  return day;
}

/** Verilen anın İstanbul'daki takvim gününü 'YYYY-MM-DD' olarak döndürür. */
export function istanbulDay(input: Date | string = new Date()): string {
  if (typeof input === 'string' && DAY_ONLY.test(input))
    return assertDay(input);
  const d = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(d.getTime())) throw new Error('Geçersiz tarih');
  // en-CA biçimi YYYY-MM-DD üretir
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ISTANBUL_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/**
 * Bir istemci tarih değerini İstanbul takvim gününe çevirir.
 * 'YYYY-MM-DD' olduğu gibi kabul edilir. Uygulamanın eski sürümünün gönderdiği
 * "İstanbul gününün UTC gece yarısı" biçimi (…T00:00:00.000Z) de aynı güne düşer.
 */
export function parseBusinessDay(input: string): string {
  if (DAY_ONLY.test(input)) return assertDay(input);
  if (/T00:00:00(\.000)?Z$/.test(input)) return assertDay(input.slice(0, 10));
  return istanbulDay(input);
}

/** Kapanış kaydı için saklama değeri (UTC gece yarısı). */
export function closingDateValue(day: string): Date {
  assertDay(day);
  return new Date(`${day}T00:00:00.000Z`);
}

/** İstanbul gününün başladığı gerçek an. Türkiye 2016'dan beri sabit UTC+3'tür. */
export function istanbulDayStart(day: string): Date {
  return new Date(`${day}T00:00:00.000+03:00`);
}

/** Bir sonraki günün 'YYYY-MM-DD' değeri. */
export function nextDay(day: string): string {
  const d = new Date(`${day}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** Bir günü n gün kaydırır. */
export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Raporlar için zorunlu from/to değerlerini doğrular ve İstanbul günlerine çevirir. */
export function parseDayRange(
  from?: string,
  to?: string,
): { fromDay: string; toDay: string } {
  if (!from || !to)
    throw new RangeError('Başlangıç ve bitiş tarihi gereklidir');
  let fromDay: string;
  let toDay: string;
  try {
    fromDay = parseBusinessDay(from);
    toDay = parseBusinessDay(to);
  } catch {
    throw new RangeError('Geçersiz tarih');
  }
  if (fromDay > toDay)
    throw new RangeError('Başlangıç tarihi bitiş tarihinden sonra olamaz');
  return { fromDay, toDay };
}
