export function get<T>(key: string): T|null {
  const item = localStorage.getItem(key);

  if (item === null) {
    return null;
  }

  return JSON.parse(item);
}

export function set<T>(key: string, item: T) {
  localStorage.setItem(key, JSON.stringify(item));
}

export function clear(key: string) {
  localStorage.removeItem(key);
}
