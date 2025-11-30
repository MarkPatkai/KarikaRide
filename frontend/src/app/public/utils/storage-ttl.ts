export function saveWithTTL<T>(key: string, data: T, ttl: number) {
  const payload = { ...((data as any) || {}), timestamp: Date.now() };
  try {
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export function loadWithTTL<T>(key: string, ttl: number): (T & { timestamp?: number }) | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as T & { timestamp?: number };
    if (parsed.timestamp && Date.now() - parsed.timestamp < ttl) {
      return parsed;
    }
    localStorage.removeItem(key);
    return null;
  } catch (err) {
    console.error('Failed to load from localStorage', err);
    return null;
  }
}
