import getUserLocale from 'get-user-locale';

export const formatCurrency = (amount?: number) => {
  const currency = getUserLocale().includes('fr') ? 'EUR' : 'USD';
  if (amount === undefined) return '-';

  return new Intl.NumberFormat(getUserLocale(), {
    style: 'currency',
    currency,
  }).format(amount);
};
