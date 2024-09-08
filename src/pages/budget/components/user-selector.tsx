import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectProps } from '@cloudscape-design/components';

import { useAuth } from '../../../auth/hooks/use-auth';
import { useSupabase } from '../../../common/hooks/use-supabase';

const fetchUsers = async (supabase: ReturnType<typeof useSupabase>) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw new Error(`Error fetching users: ${error.message}`);

  return data;
};

export const UserSelector = ({
  onUserChange,
}: {
  onUserChange: (userId: string, name: string) => void;
}) => {
  const supabase = useSupabase();
  const { user } = useAuth();
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(supabase),
  });

  const [selectedUser, setSelectedUser] = useState<SelectProps.Option | null>(null);
  const options: SelectProps['options'] = users?.map((u) => ({
    label: u.name,
    value: u.user?.toString(),
  }));

  const handleUserChange: SelectProps['onChange'] = ({ detail }) => {
    setSelectedUser(detail.selectedOption);
    onUserChange(detail.selectedOption.value!, detail.selectedOption.label ?? '');
  };

  return (
    <Select
      expandToViewport
      options={options ?? undefined}
      selectedOption={
        selectedUser ?? {
          label: users?.find((u) => u.user === user?.id)?.name,
          value: user?.id,
        }
      }
      statusType={isLoading ? 'loading' : error ? 'error' : 'finished'}
      loadingText='Fetching users...'
      onChange={handleUserChange}
    />
  );
};
