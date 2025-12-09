import { describe, it } from "node:test";
import assert from "node:assert";
import { memo } from "./memo";

describe("memo", () => {
  describe("basic functionality", () => {
    it("should cache function results", () => {
      let callCount = 0;
      const fn = memo((x: number) => {
        callCount++;
        return x * 2;
      });

      assert.strictEqual(fn(5), 10);
      assert.strictEqual(callCount, 1);

      assert.strictEqual(fn(5), 10);
      assert.strictEqual(callCount, 1); // Should not call again
    });

    it("should cache different arguments separately", () => {
      let callCount = 0;
      const fn = memo((x: number) => {
        callCount++;
        return x * 2;
      });

      assert.strictEqual(fn(5), 10);
      assert.strictEqual(fn(10), 20);
      assert.strictEqual(callCount, 2);
    });

    it("should work with no arguments", () => {
      let callCount = 0;
      const fn = memo(() => {
        callCount++;
        return 42;
      });

      assert.strictEqual(fn(), 42);
      assert.strictEqual(fn(), 42);
      assert.strictEqual(callCount, 1);
    });

    it("should work with multiple arguments", () => {
      let callCount = 0;
      const fn = memo((x: number, y: number) => {
        callCount++;
        return x + y;
      });

      assert.strictEqual(fn(2, 3), 5);
      assert.strictEqual(fn(2, 3), 5);
      assert.strictEqual(callCount, 1);

      assert.strictEqual(fn(2, 4), 6);
      assert.strictEqual(callCount, 2);
    });

    it("should work with string arguments", () => {
      let callCount = 0;
      const fn = memo((s: string) => {
        callCount++;
        return s.toUpperCase();
      });

      assert.strictEqual(fn("hello"), "HELLO");
      assert.strictEqual(fn("hello"), "HELLO");
      assert.strictEqual(callCount, 1);
    });
  });

  describe("return types", () => {
    it("should cache string results", () => {
      const fn = memo((x: number) => x.toString());
      assert.strictEqual(fn(5), "5");
      assert.strictEqual(fn(5), "5");
    });

    it("should cache object results", () => {
      const fn = memo((x: number) => ({ value: x }));
      const result1 = fn(5);
      const result2 = fn(5);
      assert.strictEqual(result1, result2); // Same reference
    });

    it("should cache array results", () => {
      const fn = memo((x: number) => [x, x * 2]);
      const result1 = fn(5);
      const result2 = fn(5);
      assert.strictEqual(result1, result2); // Same reference
    });

    it("should cache null", () => {
      let callCount = 0;
      const fn = memo((x: number) => {
        callCount++;
        return x > 0 ? x : null;
      });

      assert.strictEqual(fn(-1), null);
      assert.strictEqual(fn(-1), null);
      assert.strictEqual(callCount, 1);
    });

    it("should cache undefined", () => {
      let callCount = 0;
      const fn = memo((x: number) => {
        callCount++;
        return x > 0 ? x : undefined;
      });

      assert.strictEqual(fn(-1), undefined);
      assert.strictEqual(fn(-1), undefined);
      assert.strictEqual(callCount, 1);
    });

    it("should cache boolean results", () => {
      let callCount = 0;
      const fn = memo((x: number) => {
        callCount++;
        return x > 0;
      });

      assert.strictEqual(fn(5), true);
      assert.strictEqual(fn(5), true);
      assert.strictEqual(callCount, 1);
    });
  });

  describe("argument serialization", () => {
    it("should differentiate between similar arguments", () => {
      let callCount = 0;
      const fn = memo((x: number, y: number) => {
        callCount++;
        return x + y;
      });

      fn(1, 2);
      fn(2, 1);
      assert.strictEqual(callCount, 2); // Different order = different args
    });

    it("should work with object arguments", () => {
      let callCount = 0;
      const fn = memo((obj: { x: number }) => {
        callCount++;
        return obj.x * 2;
      });

      fn({ x: 5 });
      fn({ x: 5 });
      assert.strictEqual(callCount, 1); // Same structure
    });

    it("should work with array arguments", () => {
      let callCount = 0;
      const fn = memo((arr: number[]) => {
        callCount++;
        return arr.reduce((a, b) => a + b, 0);
      });

      fn([1, 2, 3]);
      fn([1, 2, 3]);
      assert.strictEqual(callCount, 1);
    });

    it("should handle nested objects", () => {
      let callCount = 0;
      const fn = memo((obj: { a: { b: number } }) => {
        callCount++;
        return obj.a.b;
      });

      fn({ a: { b: 5 } });
      fn({ a: { b: 5 } });
      assert.strictEqual(callCount, 1);
    });
  });

  describe("edge cases", () => {
    it("should handle zero as argument", () => {
      let callCount = 0;
      const fn = memo((x: number) => {
        callCount++;
        return x * 2;
      });

      fn(0);
      fn(0);
      assert.strictEqual(callCount, 1);
    });

    it("should handle empty string", () => {
      let callCount = 0;
      const fn = memo((s: string) => {
        callCount++;
        return s.length;
      });

      fn("");
      fn("");
      assert.strictEqual(callCount, 1);
    });

    it("should handle negative numbers", () => {
      let callCount = 0;
      const fn = memo((x: number) => {
        callCount++;
        return x * 2;
      });

      fn(-5);
      fn(-5);
      assert.strictEqual(callCount, 1);
    });

    it("should handle NaN", () => {
      let callCount = 0;
      const fn = memo((x: number) => {
        callCount++;
        return x;
      });

      fn(NaN);
      fn(NaN);
      // Note: NaN === NaN is false, but JSON.stringify(NaN) is consistent
      assert.strictEqual(callCount, 1);
    });

    it("should handle Infinity", () => {
      let callCount = 0;
      const fn = memo((x: number) => {
        callCount++;
        return x;
      });

      fn(Infinity);
      fn(Infinity);
      assert.strictEqual(callCount, 1);
    });
  });

  describe("performance characteristics", () => {
    it("should handle many different arguments", () => {
      let callCount = 0;
      const fn = memo((x: number) => {
        callCount++;
        return x * 2;
      });

      for (let i = 0; i < 1000; i++) {
        fn(i);
      }
      assert.strictEqual(callCount, 1000);

      // Call again - should use cache
      for (let i = 0; i < 1000; i++) {
        fn(i);
      }
      assert.strictEqual(callCount, 1000); // No new calls
    });

    it("should handle recursive functions", () => {
      const fib = memo((n: number): number => {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
      });

      const result = fib(10);
      assert.strictEqual(result, 55);
    });
  });

  describe("potential issues", () => {
    it("should not confuse arguments with object method names", () => {
      let callCount = 0;
      const fn = memo((key: string) => {
        callCount++;
        return key;
      });

      fn("toString");
      fn("toString");
      assert.strictEqual(callCount, 1);
    });

    it("should handle functions with side effects", () => {
      let sideEffectCount = 0;
      const fn = memo((x: number) => {
        sideEffectCount++;
        return x * 2;
      });

      fn(5);
      fn(5);
      // Side effect only happens once due to caching
      assert.strictEqual(sideEffectCount, 1);
    });

    it("cache should persist across calls", () => {
      const fn = memo((x: number) => ({ value: x }));

      const obj1 = fn(5);
      const obj2 = fn(10);
      const obj3 = fn(5);

      assert.strictEqual(obj1, obj3); // Same reference
      assert.notStrictEqual(obj1, obj2);
    });
  });
});
