import getUserLocale from 'get-user-locale';

export const formatCurrency = (amount?: number | null) => {
  const currency = getUserLocale().includes('fr') ? 'EUR' : 'USD';
  if (amount === undefined || amount === null) return '-';

  return new Intl.NumberFormat(getUserLocale(), {
    style: 'currency',
    currency,
  }).format(amount);
};
