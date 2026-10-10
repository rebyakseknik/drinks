/**
 * Abacus'un eski sürümde veritabanına eklediği gizli test hesabı.
 * Bu hesap artık hiçbir yerde kullanılamaz: giriş yapamaz, oturumu geçersizdir ve
 * "ilk kullanıcı sahip olur" kuralında / kullanıcı listesinde sayılmaz.
 * (Şifresi koddan kaldırıldı; burada yalnızca e-posta adresi tutulur.)
 */
export const LEGACY_SYSTEM_EMAILS = ['abacus-2add5a5c@example.com'];

export const REAL_USER_FILTER = { email: { notIn: LEGACY_SYSTEM_EMAILS } };

export function isLegacySystemEmail(email: string): boolean {
  return LEGACY_SYSTEM_EMAILS.includes(email.trim().toLowerCase());
}
