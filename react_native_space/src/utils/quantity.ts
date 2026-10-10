/**
 * Miktar gösterimi ve girişi — tüm ekranlar bu dosyayı kullanır.
 * Sunucuda stok her zaman temel birimde (adet, gram, mililitre) tam sayı olarak tutulur.
 * Burası yalnızca gösterim ve giriş kolaylığı içindir; varsayım yapmaz:
 * koli içeriği tanımlı değilse koli gösterilmez.
 */

export interface PackageInfo {
  /** Örn. "Koli" */
  name: string;
  /** 1 paket kaç temel birim (örn. 24) */
  factor: number;
}

export interface UnitField {
  key: string;
  /** Alan etiketi: "koli", "adet", "kg", "g", "L", "ml" */
  label: string;
  /** 1 birim = kaç temel birim */
  factor: number;
  /** Ondalık girilebilir mi (kg, L) */
  decimals: boolean;
}

function num(n: number, maxFractionDigits = 3): string {
  return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: maxFractionDigits }).format(n);
}

function lower(s: string): string {
  return s.toLocaleLowerCase('tr');
}

/** Temel birimin kısa etiketi. */
export function unitLabel(baseUnit: string): string {
  if (baseUnit === 'gram') return 'g';
  if (baseUnit === 'mililitre') return 'ml';
  return 'adet';
}

/** Yalnızca temel birim: "360 adet", "2.000 g". */
export function formatBase(qty: number, baseUnit: string): string {
  return `${num(qty, 0)} ${unitLabel(baseUnit)}`;
}

/**
 * Stok gösterimi.
 *  - adet + koli tanımlı:   "15 koli · 360 adet", "15 koli 3 adet · 363 adet", "16 adet"
 *  - adet + koli tanımsız:  "48 adet"
 *  - gram:                  "2 kg", "1,85 kg", "850 g"
 *  - mililitre:             "1,5 L", "750 ml"
 */
export function formatStock(qty: number, baseUnit: string, pkg?: PackageInfo | null): string {
  const neg = qty < 0 ? '−' : '';
  const a = Math.abs(qty);

  if (baseUnit === 'gram' || baseUnit === 'mililitre') {
    const big = baseUnit === 'gram' ? 'kg' : 'L';
    const small = unitLabel(baseUnit);
    return a >= 1000 ? `${neg}${num(a / 1000)} ${big}` : `${neg}${num(a, 0)} ${small}`;
  }

  if (pkg && pkg.factor > 1 && a >= pkg.factor) {
    const full = Math.floor(a / pkg.factor);
    const rest = a - full * pkg.factor;
    const parts = rest > 0 ? `${num(full, 0)} ${lower(pkg.name)} ${num(rest, 0)} adet` : `${num(full, 0)} ${lower(pkg.name)}`;
    return `${neg}${parts} · ${num(a, 0)} adet`;
  }
  return `${neg}${num(a, 0)} adet`;
}

/** Girişte gösterilecek alanlar (büyükten küçüğe). */
export function inputFields(baseUnit: string, pkg?: PackageInfo | null): UnitField[] {
  const fields: UnitField[] = [];
  if (pkg && pkg.factor > 1) fields.push({ key: 'pkg', label: lower(pkg.name), factor: pkg.factor, decimals: false });
  if (baseUnit === 'gram') {
    fields.push({ key: 'big', label: 'kg', factor: 1000, decimals: true });
    fields.push({ key: 'base', label: 'g', factor: 1, decimals: false });
  } else if (baseUnit === 'mililitre') {
    fields.push({ key: 'big', label: 'L', factor: 1000, decimals: true });
    fields.push({ key: 'base', label: 'ml', factor: 1, decimals: false });
  } else {
    fields.push({ key: 'base', label: 'adet', factor: 1, decimals: false });
  }
  return fields;
}

/** "1,5" / "1.5" / "" → sayı (boş = 0). Geçersizse null. */
export function parseNumber(text: string | undefined): number | null {
  const t = (text ?? '').trim();
  if (!t) return 0;
  if (!/^\d+([.,]\d+)?$/.test(t)) return null;
  return Number(t.replace(',', '.'));
}

export type TotalResult =
  | { ok: true; total: number; breakdown: string; empty: boolean }
  | { ok: false; error: string };

/**
 * Karma giriş toplamı: { pkg: "2", base: "5" } (24'lük) → 53.
 * Sonuç temel birimde tam sayı olmalıdır.
 */
export function totalFromFields(values: Record<string, string>, fields: UnitField[], baseUnit: string): TotalResult {
  let total = 0;
  const parts: string[] = [];
  let empty = true;
  for (const f of fields) {
    const raw = values[f.key];
    if (raw !== undefined && raw.trim() !== '') empty = false;
    const v = parseNumber(raw);
    if (v === null) return { ok: false, error: `${f.label}: geçerli bir sayı girin` };
    if (!f.decimals && !Number.isInteger(v)) return { ok: false, error: `${f.label}: tam sayı girin` };
    if (v > 0) parts.push(`${num(v)} ${f.label}`);
    total += v * f.factor;
  }
  const rounded = Math.round(total);
  if (Math.abs(total - rounded) > 1e-6) {
    return { ok: false, error: `Toplam ${unitLabel(baseUnit)} cinsinden tam sayı olmalı` };
  }
  return { ok: true, total: rounded, breakdown: parts.join(' + '), empty };
}

/** Sayım özeti: sistemde 2000, bulunan 1850 → fark −150, işlem sonrası 1850. */
export function countSummary(systemStock: number, counted: number) {
  return { diff: counted - systemStock, after: counted };
}

/** Farkı işaretli yazar: "−150 g", "+20 adet", "0 adet". */
export function formatSigned(diff: number, baseUnit: string): string {
  const sign = diff > 0 ? '+' : diff < 0 ? '−' : '';
  return `${sign}${num(Math.abs(diff), 0)} ${unitLabel(baseUnit)}`;
}
