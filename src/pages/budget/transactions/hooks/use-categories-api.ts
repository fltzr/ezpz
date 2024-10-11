import { useQuery } from '@tanstack/react-query';

import { useSelectedUser } from '@/hooks/use-selected-user';
import { useSupabase } from '@/hooks/use-supabase';

const fetchCategories = async (
  supabase: ReturnType<typeof useSupabase>,
  userId?: string | null
) => {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id,category_name')
    .eq('user_id', userId!);

  if (error) throw new Error(`Failed to fetch categories: ${error.message}`);

  return categories;
};

export const useCategoriesApi = () => {
  const supabase = useSupabase();
  const { selectedUser } = useSelectedUser();

  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ['categories', selectedUser?.userId],
    queryFn: () => fetchCategories(supabase, selectedUser?.userId),
    enabled: !!selectedUser?.userId,
  });

  return {
    data,
    error,
    refetch,
    isFetching,
  };
};
