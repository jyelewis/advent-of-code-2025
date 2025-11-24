import { describe, test } from "node:test";
import assert from "node:assert";
import "./arrayExtensions";

describe("Array extensions", () => {
  describe("count", () => {
    test("should count elements matching predicate", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = arr.count((x) => x > 3);
      assert.strictEqual(result, 2);
    });

    test("should return 0 for empty array", () => {
      const arr: number[] = [];
      const result = arr.count((x) => x > 0);
      assert.strictEqual(result, 0);
    });

    test("should return 0 when no elements match", () => {
      const arr = [1, 2, 3];
      const result = arr.count((x) => x > 10);
      assert.strictEqual(result, 0);
    });

    test("should count all elements when all match", () => {
      const arr = [1, 2, 3];
      const result = arr.count((x) => x > 0);
      assert.strictEqual(result, 3);
    });

    test("should work with complex predicates", () => {
      const arr = [{ x: 1 }, { x: 2 }, { x: 3 }];
      const result = arr.count((obj) => obj.x % 2 === 0);
      assert.strictEqual(result, 1);
    });

    test("should work with string arrays", () => {
      const arr = ["foo", "bar", "baz"];
      const result = arr.count((s) => s.startsWith("b"));
      assert.strictEqual(result, 2);
    });
  });

  describe("sum", () => {
    test("should sum numeric array", () => {
      const arr = [1, 2, 3, 4, 5];
      assert.strictEqual(arr.sum(), 15);
    });

    test("should return 0 for empty array", () => {
      const arr: number[] = [];
      assert.strictEqual(arr.sum(), 0);
    });

    test("should handle negative numbers", () => {
      const arr = [-1, -2, -3];
      assert.strictEqual(arr.sum(), -6);
    });

    test("should handle mixed positive and negative", () => {
      const arr = [10, -5, 3, -2];
      assert.strictEqual(arr.sum(), 6);
    });

    test("should handle decimals", () => {
      const arr = [1.5, 2.5, 3.5];
      assert.strictEqual(arr.sum(), 7.5);
    });

    test("should throw on non-numeric values", () => {
      const arr = [1, 2, "3" as any, 4];
      assert.throws(() => arr.sum(), {
        name: "TypeError",
        message: "Array contains non-numeric values",
      });
    });

    test("should handle single element", () => {
      const arr = [42];
      assert.strictEqual(arr.sum(), 42);
    });

    test("should handle zeros", () => {
      const arr = [0, 0, 0];
      assert.strictEqual(arr.sum(), 0);
    });
  });

  describe("unique", () => {
    test("should remove duplicates using key function", () => {
      const arr = [{ key: "a" }, { key: "b" }, { key: "a" }];
      const result = arr.unique();
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].key, "a");
      assert.strictEqual(result[1].key, "b");
    });

    test("should use custom key function", () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
      const result = arr.unique((x) => x.id.toString());
      assert.strictEqual(result.length, 2);
    });

    test("should handle empty array", () => {
      const arr: any[] = [];
      const result = arr.unique();
      assert.strictEqual(result.length, 0);
    });

    test("should preserve order of first occurrence", () => {
      const arr = [{ key: "c" }, { key: "a" }, { key: "b" }, { key: "a" }];
      const result = arr.unique();
      assert.strictEqual(result[0].key, "c");
      assert.strictEqual(result[1].key, "a");
      assert.strictEqual(result[2].key, "b");
    });

    test("should handle all unique elements", () => {
      const arr = [{ key: "a" }, { key: "b" }, { key: "c" }];
      const result = arr.unique();
      assert.strictEqual(result.length, 3);
    });

    test("should handle all duplicate elements", () => {
      const arr = [{ key: "a" }, { key: "a" }, { key: "a" }];
      const result = arr.unique();
      assert.strictEqual(result.length, 1);
    });

    test("should throw if key function returns falsy", () => {
      const arr = [{ key: "" }, { key: "b" }];
      assert.throws(() => arr.unique(), {
        message: "unique requires a key function",
      });
    });

    test("should work with string keys", () => {
      const arr = [
        { name: "foo", key: "1" },
        { name: "bar", key: "2" },
        { name: "baz", key: "1" },
      ];
      const result = arr.unique();
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].name, "foo");
      assert.strictEqual(result[1].name, "bar");
    });
  });

  describe("mapNotNull", () => {
    test("should map and filter out nulls", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = arr.mapNotNull((x) => (x > 3 ? x * 2 : null));
      assert.deepStrictEqual(result, [8, 10]);
    });

    test("should handle all nulls", () => {
      const arr = [1, 2, 3];
      const result = arr.mapNotNull((x) => null);
      assert.deepStrictEqual(result, []);
    });

    test("should handle no nulls", () => {
      const arr = [1, 2, 3];
      const result = arr.mapNotNull((x) => x * 2);
      assert.deepStrictEqual(result, [2, 4, 6]);
    });

    test("should handle empty array", () => {
      const arr: number[] = [];
      const result = arr.mapNotNull((x) => x * 2);
      assert.deepStrictEqual(result, []);
    });

    test("should change types correctly", () => {
      const arr = [1, 2, 3];
      const result = arr.mapNotNull((x) => (x > 2 ? x.toString() : null));
      assert.deepStrictEqual(result, ["3"]);
    });

    test("should handle complex transformations", () => {
      const arr = ["a", "b", "c"];
      const result = arr.mapNotNull((s) =>
        s === "b" ? null : s.toUpperCase(),
      );
      assert.deepStrictEqual(result, ["A", "C"]);
    });
  });

  describe("equalsArray", () => {
    test("should return true for equal arrays", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 3];
      assert.strictEqual(arr1.equalsArray(arr2), true);
    });

    test("should return false for different lengths", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2];
      assert.strictEqual(arr1.equalsArray(arr2), false);
    });

    test("should return false for different values", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 4];
      assert.strictEqual(arr1.equalsArray(arr2), false);
    });

    test("should return true for empty arrays", () => {
      const arr1: number[] = [];
      const arr2: number[] = [];
      assert.strictEqual(arr1.equalsArray(arr2), true);
    });

    test("should handle string arrays", () => {
      const arr1 = ["a", "b", "c"];
      const arr2 = ["a", "b", "c"];
      assert.strictEqual(arr1.equalsArray(arr2), true);
    });

    test("should use strict equality", () => {
      const arr1 = [1, 2, 3];
      const arr2 = ["1", "2", "3"] as any;
      assert.strictEqual(arr1.equalsArray(arr2), false);
    });

    test("should handle single element", () => {
      const arr1 = [1];
      const arr2 = [1];
      assert.strictEqual(arr1.equalsArray(arr2), true);
    });

    test("should be order-sensitive", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [3, 2, 1];
      assert.strictEqual(arr1.equalsArray(arr2), false);
    });

    test("should handle object references", () => {
      const obj = { x: 1 };
      const arr1 = [obj];
      const arr2 = [obj];
      assert.strictEqual(arr1.equalsArray(arr2), true);
    });

    test("should not deep compare objects", () => {
      const arr1 = [{ x: 1 }];
      const arr2 = [{ x: 1 }];
      assert.strictEqual(arr1.equalsArray(arr2), false);
    });
  });
});
