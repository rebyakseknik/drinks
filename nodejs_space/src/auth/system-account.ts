// Internal platform test account (seeded). It must not count as a real business user.
export const SYSTEM_ACCOUNT_EMAIL = 'abacus-2add5a5c@example.com';
export const REAL_USER_FILTER = { email: { not: SYSTEM_ACCOUNT_EMAIL } };
