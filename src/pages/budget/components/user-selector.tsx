import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Select, type SelectProps } from '@cloudscape-design/components';

import { useSupabase } from '@/hooks/use-supabase';

import { useBudgetProvider } from '../hooks/use-budget-provider';

const fetchUsers = async (supabase: ReturnType<typeof useSupabase>) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw new Error(`Error fetching users: ${error.message}`);

  return data;
};

export const UserSelector = () => {
  const { t } = useTranslation(undefined, { keyPrefix: 'budget' });
  const supabase = useSupabase();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(supabase),
  });

  const { selectedUser, setSelectedUser } = useBudgetProvider();

  const options: SelectProps['options'] = users?.map((u) => ({
    label: u.name,
    value: u.user?.toString(),
  }));

  const handleUserChange: SelectProps['onChange'] = ({ detail }) => {
    console.log(detail.selectedOption);
    setSelectedUser({
      userId: detail.selectedOption.value!,
      name: detail.selectedOption.label!,
    });
  };

  return (
    <Select
      expandToViewport
      options={options ?? undefined}
      selectedOption={
        selectedUser
          ? {
              label: selectedUser.name,
              value: selectedUser.userId,
            }
          : null
      }
      statusType={isLoading ? 'loading' : error ? 'error' : 'finished'}
      loadingText={t('common.fetchingUsers')}
      onChange={handleUserChange}
    />
  );
};
