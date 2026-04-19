const store: Record<string, string | boolean | number> = {};

export class MMKV {
  getString(key: string) { return store[key] as string | undefined; }
  set(key: string, value: string | boolean | number) { store[key] = value; }
  getBoolean(key: string) { return store[key] as boolean | undefined; }
  delete(key: string) { delete store[key]; }
  clearAll() { Object.keys(store).forEach(k => delete store[k]); }
}
