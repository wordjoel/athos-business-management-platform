import { useAuth } from '../context/AuthContext';

/**
 * Hook to get user ID for RLS filtering
 * Returns the current user's ID or null if not authenticated
 */
export function useUserId() {
  const { user } = useAuth();
  return user?.id ?? null;
}

/**
 * Hook to check if user has a specific role
 */
export function useUserRole() {
  const { user } = useAuth();
  return user?.role ?? 'visualizador';
}

/**
 * Hook to check if user has a specific permission
 */
export function useUserPermission(permission: string) {
  const { user } = useAuth();
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
  const { user } = useAuth();
  const {
    table,
    select = '*',
    filter = {},
    orderBy,
    limit,
    userIdColumn = 'user_id',
    requireAuth = true,
  } = options;

  if (requireAuth && !user) {
    return {
      data: null as T[] | null,
      error: new Error('Authentication required'),
      loading: false,
    };
  }

  const finalFilter = { ...filter };
  if (user && !(userIdColumn in finalFilter)) {
    finalFilter[userIdColumn] = user.id;
  }

  return {
    table,
    select,
    filter: finalFilter,
    orderBy,
    limit,
    userIdColumn,
  };
}

export function useRLSQuery<T extends Record<string, any>>(
  queryKey: unknown[],
  options: Parameters<typeof useRLSOptions>[0]
) {
  const rlsOptions = useRLSOptions(options);
  return {
    ...rlsOptions,
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