export interface DataEntity {
  id: string;
  [key: string]: any;
}

export class DataService<T extends DataEntity> {
  private storageKey: string;
  private seeded = false;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  getAll(): T[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  getById(id: string): T | undefined {
    return this.getAll().find(item => item.id === id);
  }

  create(item: T): T {
    const items = this.getAll();
    items.push(item);
    this.save(items);
    return item;
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const items = this.getAll();
    const idx = items.findIndex(item => item.id === id);
    if (idx === -1) return undefined;
    items[idx] = { ...items[idx], ...updates, id: items[idx].id };
    this.save(items);
    return items[idx];
  }

  delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    this.save(filtered);
    return true;
  }

  seed(defaultData: T[]): void {
    if (!localStorage.getItem(this.storageKey) && !this.seeded) {
      this.seeded = true;
      this.save(defaultData);
    }
  }

  private save(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}
