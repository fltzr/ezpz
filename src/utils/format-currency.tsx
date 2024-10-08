import getUserLocale from 'get-user-locale';

export const formatCurrency = (amount?: number) => {
  const currency = getUserLocale() === 'fr-FR' ? 'EUR' : 'USD';
  if (amount === undefined) return '-';

  return new Intl.NumberFormat(getUserLocale(), {
    style: 'currency',
    currency,
  }).format(amount);
};
