import { useEffect, useState, useCallback } from 'react';
import { supabase } from './auth';
import { useAuth } from '../context/AuthContext';

interface RealtimeOptions<T> {
  table: string;
  filter?: {
    column: string;
    value: any;
  };
  eventType?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback?: (payload: any) => void;
}

/**
 * Hook to subscribe to realtime database changes
 * @param options Configuration for the realtime subscription
 * @returns { data: T[] | null, error: Error | null, loading: boolean }
 */
export function useRealtime<T extends Record<string, any> = Record<string, any>>({
  table,
  filter,
  eventType = '*',
  callback
}: RealtimeOptions<T>) {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from(table).select('*');

      // Apply filter if provided
      if (filter) {
        query = query.eq(filter.column, filter.value);
      }

      const { data: fetchedData, error } = await query;

      if (error) throw error;
      setData(fetchedData);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [table, filter]);

  // Set up realtime subscription
  useEffect(() => {
    fetchInitialData();

    // Create a channel for realtime updates
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: eventType,
          schema: 'public',
          table: table,
          filter: filter ? `${filter.column}:eq.${filter.value}` : undefined,
        },
        (payload) => {
          // Call custom callback if provided
          if (callback) {
            callback(payload);
          }

          // Update local data based on the event type
          setData((currentData) => {
            if (!currentData) return [payload.new as T];

            switch (payload.eventType) {
              case 'INSERT':
                return [...currentData, payload.new as T];
              case 'UPDATE':
                return currentData.map((item) =>
                  (item as any).id === (payload.new as any).id
                    ? (payload.new as T)
                    : item
                );
              case 'DELETE':
                return currentData.filter(
                  (item) => (item as any).id !== (payload.old as any).id
                );
              default:
                return currentData;
            }
          });
        }
      )
      .subscribe();

  // Clean up subscription on unmount
  return () => {
    supabase.removeChannel(channel);
  };
  }, [table, filter, eventType, callback, fetchInitialData]);

  // Refetch when filter changes
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return { data, error, loading };
}

/**
 * Hook specifically for user-scoped data (RLS ready)
 * Automatically filters by current user ID
 */
export function useUserRealtime<T extends Record<string, any> = Record<string, any>>({
  table,
  eventType = '*',
  callback
}: Omit<RealtimeOptions<T>, 'filter'> & { userIdColumn?: string }) {
  const { user } = useAuth();
  const userIdColumn = 'user_id'; // Default column name for user ID

  return useRealtime<T>({
    table,
    filter: user ? { column: userIdColumn, value: user.id } : undefined,
    eventType,
    callback,
  });
}

// Helper function to manually subscribe (for use outside of React components)
export function subscribeToTable<T extends Record<string, any> = Record<string, any>>({
  table,
  filter,
  eventType = '*',
  callback
}: RealtimeOptions<T>) {
  let channel = supabase
    .channel(`public:${table}`)
    .on(
      'postgres_changes',
      {
        event: eventType,
        schema: 'public',
        table: table,
        filter: filter ? `${filter.column}:eq.${filter.value}` : undefined,
      },
      (payload) => {
        if (callback) callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export default { useRealtime, useUserRealtime, subscribeToTable };