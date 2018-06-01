export function get<T>(key: string): T|null {
  const item = localStorage.getItem(key);

  if (item === null) {
    return null;
  }

  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
}

export function set<T>(key: string, item: T) {
  localStorage.setItem(key, JSON.stringify(item));
}

export function clear(key: string) {
  localStorage.removeItem(key);
}
