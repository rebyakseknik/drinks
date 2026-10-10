// @ts-nocheck

export type ExpenseResponseDtoCategory = typeof ExpenseResponseDtoCategory[keyof typeof ExpenseResponseDtoCategory];


export const ExpenseResponseDtoCategory = {
  personel_maasi: 'personel_maasi',
  kira: 'kira',
  fatura: 'fatura',
  malzeme: 'malzeme',
  diger: 'diger',
} as const;
