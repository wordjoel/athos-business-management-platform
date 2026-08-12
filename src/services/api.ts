import { supabase } from '../lib/supabase';

type SyncStatus = 'online' | 'offline' | 'syncing';

interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  tabela: string;
  registro_id: string;
  dados: unknown;
  timestamp: number;
}

// ============================================
// NETWORK STATUS
// ============================================

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

// ============================================
// API CENTRAL (Supabase)
// ============================================

class ApiCentral {
  private syncInProgress = false;
  private deviceId: string;

  constructor() {
    this.deviceId = localStorage.getItem('athos_device_id') || this.generateDeviceId();
    localStorage.setItem('athos_device_id', this.deviceId);
  }

  private generateDeviceId(): string {
    return 'device_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  getDeviceId(): string {
    return this.deviceId;
  }

  // ============================================
  // CRUD Operations
  // ============================================

  async create<T extends { id?: string }>(table: string, item: Omit<T, 'id' | 'criado_em'>): Promise<T | null> {
    const { data, error } = await supabase
      .from(table)
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error(`Erro ao criar ${table}:`, error);
      return null;
    }

    return data;
  }

  async getAll<T>(table: string): Promise<T[]> {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error(`Erro ao buscar ${table}:`, error);
      return [];
    }

    return data || [];
  }

  async getById<T>(table: string, id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erro ao buscar ${table} por ID:`, error);
      return null;
    }

    return data;
  }

  async update<T>(table: string, id: string, updates: Partial<T>): Promise<T | null> {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Erro ao atualizar ${table}:`, error);
      return null;
    }

    return data;
  }

  async delete(table: string, id: string): Promise<boolean> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erro ao deletar ${table}:`, error);
      return false;
    }

    return true;
  }

  async query<T>(table: string, filters: Record<string, any>): Promise<T[]> {
    let query = supabase.from(table).select('*');

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { data, error } = await query;

    if (error) {
      console.error(`Erro ao consultar ${table}:`, error);
      return [];
    }

    return data || [];
  }

  // ============================================
  // Sync Queue
  // ============================================

  notifyChange(action: 'create' | 'update' | 'delete', table: string, id: string, data?: unknown): void {
    if (getNetworkStatus() === 'online') {
      this.queueSync({
        id: Date.now().toString(),
        action,
        tabela: table,
        registro_id: id,
        dados: data || { id },
        timestamp: Date.now(),
      });
    }
  }

  async syncToSupabase(): Promise<{ synced: number; failed: number }> {
    if (this.syncInProgress || getNetworkStatus() !== 'online') {
      return { synced: 0, failed: 0 };
    }

    this.syncInProgress = true;
    const queue = this.getSyncQueue();
    let synced = 0;
    let failed = 0;

    for (const item of queue) {
      try {
        if (item.action === 'create') {
          const existing = await this.getById(item.tabela, item.registro_id);
          if (existing) {
            await this.update(item.tabela, item.registro_id, item.dados as any);
          } else {
            await this.create(item.tabela, { ...item.dados as any, id: item.registro_id });
          }
        } else if (item.action === 'update') {
          await this.update(item.tabela, item.registro_id, item.dados as any);
        } else if (item.action === 'delete') {
          await this.delete(item.tabela, item.registro_id);
        }
        synced++;
      } catch (err) {
        console.warn(`Sync failed for ${item.tabela}/${item.registro_id}:`, err);
        failed++;
      }
    }

    if (failed === 0) {
      localStorage.removeItem('athos_sync_queue');
    } else {
      const remaining = queue.slice(synced);
      localStorage.setItem('athos_sync_queue', JSON.stringify(remaining));
    }

    this.syncInProgress = false;
    return { synced, failed };
  }

  async pullFromSupabase(): Promise<number> {
    if (getNetworkStatus() !== 'online') return 0;

    const tables = [
      'usuarios', 'lancamentos', 'contas_bancarias', 'extratos_bancarios',
      'pix_chaves', 'pix_transacoes', 'boletos', 'cartoes',
      'leads', 'tarefas', 'chamados', 'arquivos', 'contratos',
    ];

    let total = 0;

    for (const table of tables) {
      try {
        const data = await this.getAll(table);
        if (data.length > 0) {
          localStorage.setItem(`athos_${table}`, JSON.stringify(data));
          total += data.length;
        }
      } catch (err) {
        console.warn(`Pull failed for ${table}:`, err);
      }
    }

    return total;
  }

  // ============================================
  // Export/Import
  // ============================================

  async exportAll(): Promise<Record<string, unknown>> {
    const result: Record<string, unknown> = {};
    const tables = [
      'usuarios', 'lancamentos', 'contas_bancarias', 'extratos_bancarios',
      'pix_chaves', 'pix_transacoes', 'boletos', 'cartoes',
      'leads', 'tarefas', 'chamados', 'arquivos', 'contratos',
    ];

    for (const table of tables) {
      try {
        result[table] = await this.getAll(table);
      } catch (err) {
        console.warn(`Export failed for ${table}:`, err);
      }
    }

    return result;
  }

  async importAll(data: Record<string, unknown>): Promise<number> {
    let count = 0;

    for (const [table, items] of Object.entries(data)) {
      if (Array.isArray(items)) {
        for (const item of items) {
          try {
            await this.create(table, item);
            count++;
          } catch (err) {
            console.warn(`Import failed for ${table}:`, err);
          }
        }
      }
    }

    return count;
  }

  // ============================================
  // Private Methods
  // ============================================

  private queueSync(item: SyncQueueItem): void {
    const queue = this.getSyncQueue();
    queue.push(item);
    localStorage.setItem('athos_sync_queue', JSON.stringify(queue));
  }

  private getSyncQueue(): SyncQueueItem[] {
    try {
      const raw = localStorage.getItem('athos_sync_queue');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export const api = new ApiCentral();

// ============================================
// AUTO SYNC (every 30 seconds)
// ============================================

let syncInterval: ReturnType<typeof setInterval> | null = null;

export function startAutoSync(): void {
  if (syncInterval) return;

  syncInterval = setInterval(async () => {
    if (getNetworkStatus() === 'online') {
      await api.syncToSupabase();
    }
  }, 30000);
}

export function stopAutoSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}

// Start auto sync when module loads
if (typeof window !== 'undefined') {
  startAutoSync();
}
