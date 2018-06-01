export function find<T>(array: T[], predicate: (item: T) => boolean): T|undefined {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return array[i];
    }
  }

  return undefined;
}

export function remove<T>(array: T[], predicate: (item: T) => boolean): T[] {
  const removedElements: T[] = [];

  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      removedElements.push(array[i]);
      array.splice(i, 1);
    }
  }

  return removedElements;
}

export function forEach<T>(array: T[], iteratee: (item: T) => void): void {
  for (let i = 0; i < array.length; i++) {
    iteratee(array[i]);
  }
}

export function isArray(item: any): item is any[] {
  return item && item.constructor === Array;
}

export function map<T, R>(array: T[], transformer: (item: T) => R): R[] {
  const transformedItems: R[] = [];

  for (let i = 0; i < array.length; i++) {
    transformedItems.push(transformer(array[i]));
  }

  return transformedItems;
}

export function every<T>(array: T[], predicate: (item: T) => boolean): boolean {
  for (let i = 0; i < array.length; i++) {
    if (!predicate(array[i])) {
      return false;
    }
  }

  return true;
}
