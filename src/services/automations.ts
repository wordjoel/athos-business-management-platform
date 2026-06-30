import { getLancamentos } from './lancamentoService';

interface AutomationRule {
  id: string;
  name: string;
  trigger: 'schedule' | 'event' | 'condition';
  schedule?: string;
  event?: string;
  condition?: (data: unknown) => boolean;
  action: () => Promise<void> | void;
  enabled: boolean;
  lastRun?: string;
  interval?: number;
}

interface ScheduledTask {
  id: string;
  name: string;
  type: 'notification' | 'report' | 'sync' | 'cleanup' | 'backup';
  cron: string;
  lastRun: string | null;
  enabled: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  module: string;
  read: boolean;
  createdAt: string;
}

const NOTIFICATIONS_KEY = 'athos_notifications';
const TASKS_KEY = 'athos_scheduled_tasks';

class AutomationsEngine {
  private rules: AutomationRule[] = [];
  private intervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private listeners: Array<(notification: Notification) => void> = [];

  registerRule(rule: AutomationRule): string {
    this.rules.push(rule);
    if (rule.enabled && rule.trigger === 'schedule' && rule.interval) {
      this.startInterval(rule);
    }
    return rule.id;
  }

  private startInterval(rule: AutomationRule): void {
    if (!rule.interval) return;
    const id = setInterval(async () => {
      try {
        await rule.action();
        rule.lastRun = new Date().toISOString();
      } catch (err) {
        console.warn(`Automation rule "${rule.name}" failed:`, err);
      }
    }, rule.interval);
    this.intervals.set(rule.id, id);
  }

  stopAll(): void {
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals.clear();
  }

  async triggerEvent(event: string, data?: unknown): Promise<void> {
    const matching = this.rules.filter(
      r => r.enabled && r.trigger === 'event' && r.event === event
    );

    for (const rule of matching) {
      try {
        if (rule.condition && !rule.condition(data)) continue;
        await rule.action();
        rule.lastRun = new Date().toISOString();
      } catch (err) {
        console.warn(`Event automation "${rule.name}" failed:`, err);
      }
    }
  }

  // Notifications
  addNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification {
    const newNotif: Notification = {
      ...notification,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      read: false,
      createdAt: new Date().toISOString(),
    };

    const notifs = this.getNotifications();
    notifs.unshift(newNotif);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs.slice(0, 100)));

    this.listeners.forEach(cb => cb(newNotif));
    return newNotif;
  }

  getNotifications(): Notification[] {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  markAsRead(id: string): void {
    const notifs = this.getNotifications();
    const idx = notifs.findIndex(n => n.id === id);
    if (idx !== -1) {
      notifs[idx].read = true;
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
    }
  }

  markAllAsRead(): void {
    const notifs = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  }

  onNotification(callback: (notification: Notification) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Scheduled tasks
  getScheduledTasks(): ScheduledTask[] {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      return raw ? JSON.parse(raw) : this.getDefaultTasks();
    } catch {
      return this.getDefaultTasks();
    }
  }

  private getDefaultTasks(): ScheduledTask[] {
    const tasks: ScheduledTask[] = [
      { id: 'task-sync', name: 'Sincronização Supabase', type: 'sync', cron: '0 */30 * * *', lastRun: null, enabled: true },
      { id: 'task-alerts', name: 'Verificação de Alertas Financeiros', type: 'notification', cron: '0 */6 * * *', lastRun: null, enabled: true },
      { id: 'task-backup', name: 'Backup Automático', type: 'backup', cron: '0 2 * * 0', lastRun: null, enabled: true },
      { id: 'task-cleanup', name: 'Limpeza de Cache', type: 'cleanup', cron: '0 3 * * 1', lastRun: null, enabled: true },
    ];
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return tasks;
  }

  toggleTask(taskId: string, enabled: boolean): void {
    const tasks = this.getScheduledTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.enabled = enabled;
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }
  }

  runTask(taskId: string): Promise<void> {
    const tasks = this.getScheduledTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return Promise.resolve();

    task.lastRun = new Date().toISOString();
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

    switch (task.type) {
      case 'sync':
        return this.runSync();
      case 'notification':
        return this.runAlertCheck();
      case 'backup':
        return this.runAutoBackup();
      case 'cleanup':
        return this.runCleanup();
      default:
        return Promise.resolve();
    }
  }

  private async runSync(): Promise<void> {
    const { api } = await import('./api');
    await api.syncToSupabase();
    this.addNotification({
      title: 'Sincronização concluída',
      message: 'Dados sincronizados com o servidor.',
      type: 'success',
      module: 'Sistema',
    });
  }

  private async runAlertCheck(): Promise<void> {
    const lancamentos = getLancamentos();
    const atrasados = lancamentos.filter(l => l.status === 'atrasado');

    if (atrasados.length > 0) {
      const total = atrasados.reduce((s, l) => s + l.valor, 0);
      this.addNotification({
        title: `${atrasados.length} lançamento(s) atrasado(s)`,
        message: `Valor total em atraso: R$ ${total.toLocaleString()}`,
        type: 'warning',
        module: 'Financeiro',
      });
    }
  }

  private async runAutoBackup(): Promise<void> {
    const { api } = await import('./api');
    const data = api.exportAll();
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data,
    };
    localStorage.setItem('athos_auto_backup', JSON.stringify(backup));
  }

  private async runCleanup(): Promise<void> {
    const keys = Object.keys(localStorage).filter(k =>
      k.startsWith('athos_ai_cache') || k.startsWith('athos_temp_')
    );
    keys.forEach(k => localStorage.removeItem(k));
  }

  // Financial alert rules
  setupDefaultRules(): void {
    this.registerRule({
      id: 'rule-atraso',
      name: 'Alerta de Atraso Financeiro',
      trigger: 'event',
      event: 'lancamento:created',
      condition: (data: unknown) => {
        const item = data as any;
        return item?.status === 'atrasado';
      },
      action: () => {
        this.addNotification({
          title: 'Lançamento em atraso registrado',
          message: 'Um novo lançamento com status atrasado foi criado.',
          type: 'warning',
          module: 'Financeiro',
        });
      },
      enabled: true,
    });

    this.registerRule({
      id: 'rule-diario',
      name: 'Resumo Diário',
      trigger: 'schedule',
      interval: 86400000,
      action: () => {
        const lancamentos = getLancamentos();
        const pendentes = lancamentos.filter(l => l.status === 'pendente').length;
        const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
        const valorPendente = lancamentos.filter(l => l.status === 'pendente').reduce((s, l) => s + l.valor, 0);

        this.addNotification({
          title: 'Resumo Diário',
          message: `${pendentes} pendências • Total: ${fmt(valorPendente)}`,
          type: 'info',
          module: 'Dashboard',
        });
      },
      enabled: true,
    });

    this.registerRule({
      id: 'rule-notificacao-local',
      name: 'Notificação via Service Worker',
      trigger: 'event',
      event: 'notification:created',
      action: () => {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'CHECK_NOTIFICATIONS' });
        }
      },
      enabled: true,
    });
  }
}

export const automations = new AutomationsEngine();
