import { useApp } from '../context/AppContext';
import { useUserRealtime } from './realtime';

/**
 * Hook to get user ID for RLS filtering
 * Returns the current user's ID or null if not authenticated
 */
export function useUserId() {
  const { user } = useApp();
  return user?.id ?? null;
}

/**
 * Hook to check if user has a specific role
 */
export function useUserRole() {
  const { user } = useApp();
  return user?.role ?? 'user'; // default to 'user' if not authenticated
}

/**
 * Hook to check if user has a specific permission
 */
export function useUserPermission(permission: string) {
  const { user } = useApp();
  return user?.permissions.includes(permission) ?? false;
}

/**
 * Hook to get filtered query options for RLS
 * Automatically adds user_id filter when needed
 */
export function useRLSOptions<T extends Record<string, any>>(
  options: {
    table: string;
    select?: string;
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    userIdColumn?: string;
    requireAuth?: boolean;
  }
) {
  const { user } = useApp();
  const {
    table,
    select = '*',
    filter = {},
    orderBy,
    limit,
    userIdColumn = 'user_id',
    requireAuth = true,
  } = options;

  // If authentication is required and user is not authenticated, return empty options
  if (requireAuth && !user) {
    return {
      data: null as T[] | null,
      error: new Error('Authentication required'),
      loading: false,
    };
  }

  // Prepare filters - add user_id filter if not already present and user exists
  const finalFilter = { ...filter };
  if (user && !(userIdColumn in finalFilter)) {
    finalFilter[userIdColumn] = user.id;
  }

  // In a real implementation, this would return a Supabase query builder
  // For now, we'll return the options that can be used with useQuery or similar
  return {
    table,
    select,
    filter: finalFilter,
    orderBy,
    limit,
    userIdColumn,
  };
}

/**
 * Wrapper around useQuery that automatically applies RLS filtering
 * This would be used instead of raw useQuery calls in components
 */
export function useRLSQuery<T extends Record<string, any>>(
  queryKey: unknown[],
  options: Parameters<typeof useRLSOptions>[0]
) {
  // In a real implementation with React Query:
  // const rlsOptions = useRLSOptions(options);
  // return useQuery<T[]>({
  //   queryKey,
  //   queryFn: () => {
  //     let query = supabase.from(rlsOptions.table).select(rlsOptions.select);
  //     
  //     // Apply filters
  //     Object.entries(rlsOptions.filter).forEach(([column, value]) => {
  //       if (value !== undefined && value !== null) {
  //         query = query.eq(column, value);
  //       }
  //     });
  //     
  //     // Apply ordering
  //     if (rlsOptions.orderBy) {
  //       query = query.order(rlsOptions.orderBy.column, {
  //         ascending: rlsOptions.orderBy.ascending ?? true
  //       });
  //     }
  //     
  //     // Apply limit
  //     if (rlsOptions.limit) {
  //       query = query.limit(rlsOptions.limit);
  //     }
  //     
  //     return query.then(({ data, error }) => {
  //       if (error) throw error;
  //       return data ?? [];
  //     });
  //   }
  // });
  
  // For now, we'll return a placeholder that components can adapt
  const rlsOptions = useRLSOptions(options);
  return {
    ...rlsOptions,
    // This would normally be the result from useQuery
    data: null,
    error: null,
    loading: true,
  };
}

export default {
  useUserId,
  useUserRole,
  useUserPermission,
  useRLSOptions,
  useRLSQuery,
};