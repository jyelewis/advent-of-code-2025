// its a crime I know, but for AOC some QOL enhancements go a long way
import assert from "node:assert";

declare global {
  interface Array<T> {
    count(fn: (item: T) => boolean): number;
    sum(): number;
    unique(fn?: (item: T) => string): Array<T>;
    mapNotNull<O>(fn: (item: T) => null | O): O[];
    equalsArray<O>(otherArray: O[]): boolean;
  }
}

Array.prototype.count = function (fn: (item: any) => boolean): number {
  return this.reduce((acc, val) => {
    return acc + (fn(val) ? 1 : 0);
  }, 0);
};

Array.prototype.sum = function (): number {
  return this.reduce((acc, val) => {
    if (typeof val !== "number") {
      throw new TypeError("Array contains non-numeric values");
    }

    return acc + val;
  }, 0);
};

Array.prototype.unique = function (fn?: (item: any) => string): Array<any> {
  if (!fn) {
    fn = (item: any) => item.key;
  }

  const seenItems = new Set<string>();

  return this.filter((item: any) => {
    const itemKey = fn(item);
    assert(itemKey, "unique requires a key function");

    if (seenItems.has(itemKey)) {
      return false;
    }
    seenItems.add(itemKey);
    return true;
  });
};

Array.prototype.mapNotNull = function <O>(fn: (item: any) => null | O): O[] {
  return this.map(fn).filter((x) => x !== null);
};

Array.prototype.equalsArray = function <O>(otherArray: O[]): boolean {
  if (this.length !== otherArray.length) {
    return false;
  }

  for (let i = 0; i < this.length; i++) {
    if (this[i] !== otherArray[i]) {
      return false;
    }
  }

  return true;
};

export {};
