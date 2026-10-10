import { Alert, Platform } from 'react-native';

export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  personel_maasi: 'Personel Maaşı',
  kira: 'Kira',
  fatura: 'Fatura (elektrik, su…)',
  malzeme: 'Malzeme / Sarf',
  diger: 'Diğer',
};

export const EXPENSE_CATEGORY_ICONS: Record<string, string> = {
  personel_maasi: 'people',
  kira: 'home',
  fatura: 'flash',
  malzeme: 'basket',
  diger: 'ellipsis-horizontal-circle',
};

export const WAGE_PERIOD_LABELS: Record<string, string> = {
  gunluk: 'Günlük',
  haftalik: 'Haftalık',
  aylik: 'Aylık',
};

/** Haftanın pazartesi gününü döndürür ('YYYY-MM-DD'). */
export function weekStart(day: string): string {
  const d = new Date(`${day}T00:00:00.000Z`);
  if (isNaN(d.getTime())) return day;
  const offset = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

/** Ayın ilk ve son günü. month: 0-11 */
export function monthRange(year: number, month: number): { from: string; to: string } {
  const from = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);
  const to = new Date(Date.UTC(year, month + 1, 0)).toISOString().slice(0, 10);
  return { from, to };
}

/** 540 → "9 sa" · 510 → "8,5 sa" */
export function formatHours(minutes: number | null | undefined): string {
  const h = (minutes ?? 0) / 60;
  const text = Number.isInteger(h) ? String(h) : h.toFixed(1).replace('.', ',');
  return `${text} sa`;
}

/**
 * Saat girişini "SS:DD" biçimine çevirir. "9" → "09:00", "930" → "09:30", "16.30" → "16:30".
 * Geçersizse null.
 */
export function normalizeTime(text: string): string | null {
  const t = (text ?? '').trim().replace(/[.,\s]/g, ':');
  let h: number;
  let m: number;
  if (/^\d{1,2}$/.test(t)) {
    h = Number(t);
    m = 0;
  } else if (/^\d{3,4}$/.test(t)) {
    h = Number(t.slice(0, t.length - 2));
    m = Number(t.slice(-2));
  } else if (/^\d{1,2}:\d{1,2}$/.test(t)) {
    const [a, b] = t.split(':');
    h = Number(a);
    m = Number(b);
  } else {
    return null;
  }
  if (h === 24 && m === 0) h = 0;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Platformdan bağımsız onay penceresi. */
export function confirmAction(title: string, message: string, confirmText: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    if (typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Vazgeç', style: 'cancel' },
    { text: confirmText, style: 'destructive', onPress: onConfirm },
  ]);
}
