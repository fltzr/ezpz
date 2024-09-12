import { DateTime } from 'luxon';

export const addMonths = (months: number) => {
  const now = DateTime.now();
  const endDate = now.plus({ months });

  return endDate.toFormat('MMM yyyy');
};
