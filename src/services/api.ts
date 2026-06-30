import { supabase } from '../lib/auth';
import { DataService, DataEntity } from './dataService';

type SyncStatus = 'online' | 'offline' | 'syncing';

interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  storageKey: string;
  data: unknown;
  timestamp: number;
}

const SYNC_QUEUE_KEY = 'athos_sync_queue';
const NETWORK_CHECK_KEY = 'athos_network_status';

export function getNetworkStatus(): SyncStatus {
  if (!navigator.onLine) return 'offline';
  return 'online';
}

export function listenNetworkChanges(callback: (status: SyncStatus) => void): () => void {
  const onOnline = () => callback('online');
  const onOffline = () => callback('offline');
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

class ApiCentral {
  private services = new Map<string, DataService<any>>();
  private syncInProgress = false;

  register<T extends DataEntity>(storageKey: string, seedData?: T[]): DataService<T> {
    const existing = this.services.get(storageKey) as DataService<T> | undefined;
    if (existing) return existing;

    const service = new DataService<T>(storageKey);
    if (seedData) service.seed(seedData);
    this.services.set(storageKey, service);
    return service;
  }

  useExisting<T extends DataEntity>(storageKey: string, service: DataService<T>): void {
    if (!this.services.has(storageKey)) {
      this.services.set(storageKey, service);
    }
  }

  notifyChange(action: 'create' | 'update' | 'delete', storageKey: string, id: string, data?: unknown): void {
    if (getNetworkStatus() === 'online') {
      this.queueSync({ id, action, storageKey, data: data || { id }, timestamp: Date.now() });
    }
  }

  getService<T extends DataEntity>(storageKey: string): DataService<T> | undefined {
    return this.services.get(storageKey) as DataService<T> | undefined;
  }

  getAllServices(): Map<string, DataService<any>> {
    return this.services;
  }

  async create<T extends DataEntity>(storageKey: string, item: T): Promise<T> {
    const service = this.services.get(storageKey) as DataService<T>;
    if (!service) throw new Error(`Service not registered: ${storageKey}`);

    const created = service.create(item);

    if (getNetworkStatus() === 'online') {
      this.queueSync({ id: created.id, action: 'create', storageKey, data: created, timestamp: Date.now() });
    }

    return created;
  }

  async update<T extends DataEntity>(storageKey: string, id: string, updates: Partial<T>): Promise<T | undefined> {
    const service = this.services.get(storageKey) as DataService<T>;
    if (!service) throw new Error(`Service not registered: ${storageKey}`);

    const updated = service.update(id, updates);

    if (updated && getNetworkStatus() === 'online') {
      this.queueSync({ id, action: 'update', storageKey, data: updates, timestamp: Date.now() });
    }

    return updated;
  }

  async delete(storageKey: string, id: string): Promise<boolean> {
    const service = this.services.get(storageKey);
    if (!service) throw new Error(`Service not registered: ${storageKey}`);

    const result = service.delete(id);

    if (result && getNetworkStatus() === 'online') {
      this.queueSync({ id, action: 'delete', storageKey, data: { id }, timestamp: Date.now() });
    }

    return result;
  }

  async syncToSupabase(): Promise<{ synced: number; failed: number }> {
    if (this.syncInProgress || getNetworkStatus() !== 'online') return { synced: 0, failed: 0 };

    this.syncInProgress = true;
    const queue = this.getSyncQueue();
    let synced = 0;
    let failed = 0;

    for (const item of queue) {
      try {
        const tableName = item.storageKey.replace('athos_', '');
        if (item.action === 'create') {
          const { error } = await supabase.from(tableName).insert(item.data);
          if (error) throw error;
        } else if (item.action === 'update') {
          const { error } = await supabase.from(tableName).update(item.data).eq('id', item.id);
          if (error) throw error;
        } else if (item.action === 'delete') {
          const { error } = await supabase.from(tableName).delete().eq('id', item.id);
          if (error) throw error;
        }
        synced++;
      } catch (err) {
        console.warn(`Sync failed for ${item.storageKey}/${item.id}:`, err);
        failed++;
      }
    }

    if (failed === 0) {
      localStorage.removeItem(SYNC_QUEUE_KEY);
    } else {
      const remaining = queue.filter((_, i) => i >= synced);
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remaining));
    }

    this.syncInProgress = false;
    return { synced, failed };
  }

  async pullFromSupabase(): Promise<number> {
    if (getNetworkStatus() !== 'online') return 0;
    let total = 0;

    for (const [storageKey] of this.services) {
      try {
        const tableName = storageKey.replace('athos_', '');
        const { data, error } = await supabase.from(tableName).select('*');
        if (error) continue;
        if (data && data.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(data));
          total += data.length;
        }
      } catch {
        // Silently fail per table
      }
    }

    return total;
  }

  exportAll(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key] of this.services) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) result[key] = JSON.parse(raw);
      } catch {
        result[key] = localStorage.getItem(key);
      }
    }
    return result;
  }

  importAll(data: Record<string, unknown>): number {
    let count = 0;
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('athos_')) {
        localStorage.setItem(key, JSON.stringify(value));
        count++;
      }
    });
    return count;
  }

  private queueSync(item: SyncQueueItem): void {
    const queue = this.getSyncQueue();
    queue.push(item);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  }

  private getSyncQueue(): SyncQueueItem[] {
    try {
      const raw = localStorage.getItem(SYNC_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export const api = new ApiCentral();
