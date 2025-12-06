// its a crime I know, but for AOC some QOL enhancements go a long way
import assert from "node:assert";

declare global {
  interface Array<T> {
    count(fn: (item: T, index: number) => boolean): number;
    sum(): number;
    product(): number;
    unique(fn?: (item: T) => string): Array<T>;
    mapNotNull<O>(fn: (item: T, index: number) => null | O): O[];
    equalsArray<O>(otherArray: O[]): boolean;
    findOne(predicate: (item: T) => boolean): T;
  }
}

Array.prototype.count = function (fn: (item: any, index: number) => boolean): number {
  return this.reduce((acc, val, index) => {
    return acc + (fn(val, index) ? 1 : 0);
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

Array.prototype.product = function (): number {
  return this.reduce((acc, val) => {
    if (typeof val !== "number") {
      throw new TypeError("Array contains non-numeric values");
    }

    return acc * val;
  }, 1);
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

Array.prototype.mapNotNull = function <O>(fn: (item: any, index: number) => null | O): O[] {
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

Array.prototype.findOne = function <T>(predicate: (item: T) => boolean): T {
  const results = this.filter(predicate);
  if (results.length === 0) {
    throw new Error("Could not find item");
  }
  if (results.length > 1) {
    throw new Error("Found more than one item");
  }

  return results[0];
};

export {};
