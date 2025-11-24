export function memo<Args extends Array<unknown>, RetVal>(
  fn: (...args: Args) => RetVal,
): (...args: Args) => RetVal {
  const cache = new Map<string, RetVal>();
  return (...args: Args): RetVal => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
