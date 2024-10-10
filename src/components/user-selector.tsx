import { useTranslation } from 'react-i18next';

import { Select, type SelectProps } from '@cloudscape-design/components';
import { useQuery } from '@tanstack/react-query';

import { useSelectedUser } from '@/hooks/use-selected-user';
import { useSupabase } from '@/hooks/use-supabase';

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

  const { selectedUser, setSelectedUser } = useSelectedUser();

  const options: SelectProps['options'] = users?.map((u) => ({
    label: u.name,
    value: u.user?.toString(),
  }));

  const handleUserChange: SelectProps['onChange'] = ({ detail }) => {
    setSelectedUser({
      userId: detail.selectedOption.value!,
      name: detail.selectedOption.label!,
    });
  };

  return (
    <Select
      expandToViewport
      inlineLabelText='Select a user'
      options={options ?? undefined}
      selectedOption={
        selectedUser
          ? {
              label: selectedUser.name ?? '',
              value: selectedUser.userId ?? '',
            }
          : null
      }
      statusType={isLoading ? 'loading' : error ? 'error' : 'finished'}
      loadingText={t('common.fetchingUsers')}
      onChange={handleUserChange}
    />
  );
};
