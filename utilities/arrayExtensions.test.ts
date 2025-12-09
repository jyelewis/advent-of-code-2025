import { describe, it } from "node:test";
import assert from "node:assert";
import "./arrayExtensions";

describe("Array extensions", () => {
  describe("count", () => {
    it("should count elements matching predicate", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = arr.count((x) => x > 3);
      assert.strictEqual(result, 2);
    });

    it("should return 0 for empty array", () => {
      const arr: number[] = [];
      const result = arr.count((x) => x > 0);
      assert.strictEqual(result, 0);
    });

    it("should return 0 when no elements match", () => {
      const arr = [1, 2, 3];
      const result = arr.count((x) => x > 10);
      assert.strictEqual(result, 0);
    });

    it("should count all elements when all match", () => {
      const arr = [1, 2, 3];
      const result = arr.count((x) => x > 0);
      assert.strictEqual(result, 3);
    });

    it("should work with complex predicates", () => {
      const arr = [{ x: 1 }, { x: 2 }, { x: 3 }];
      const result = arr.count((obj) => obj.x % 2 === 0);
      assert.strictEqual(result, 1);
    });

    it("should work with string arrays", () => {
      const arr = ["foo", "bar", "baz"];
      const result = arr.count((s) => s.startsWith("b"));
      assert.strictEqual(result, 2);
    });

    it("should pass index to predicate", () => {
      const arr = [10, 20, 30, 40, 50];
      const result = arr.count((x, i) => i > 2);
      assert.strictEqual(result, 2);
    });

    it("should work with both value and index in predicate", () => {
      const arr = [5, 10, 15, 20, 25];
      const result = arr.count((x, i) => x > 10 && i < 4);
      assert.strictEqual(result, 2); // 15 at index 2, 20 at index 3
    });
  });

  describe("sum", () => {
    it("should sum numeric array", () => {
      const arr = [1, 2, 3, 4, 5];
      assert.strictEqual(arr.sum(), 15);
    });

    it("should return 0 for empty array", () => {
      const arr: number[] = [];
      assert.strictEqual(arr.sum(), 0);
    });

    it("should handle negative numbers", () => {
      const arr = [-1, -2, -3];
      assert.strictEqual(arr.sum(), -6);
    });

    it("should handle mixed positive and negative", () => {
      const arr = [10, -5, 3, -2];
      assert.strictEqual(arr.sum(), 6);
    });

    it("should handle decimals", () => {
      const arr = [1.5, 2.5, 3.5];
      assert.strictEqual(arr.sum(), 7.5);
    });

    it("should throw on non-numeric values", () => {
      const arr = [1, 2, "3" as any, 4];
      assert.throws(() => arr.sum(), {
        name: "TypeError",
        message: "Array contains non-numeric values",
      });
    });

    it("should handle single element", () => {
      const arr = [42];
      assert.strictEqual(arr.sum(), 42);
    });

    it("should handle zeros", () => {
      const arr = [0, 0, 0];
      assert.strictEqual(arr.sum(), 0);
    });
  });

  describe("product", () => {
    it("should product numeric array", () => {
      const arr = [1, 2, 3, 4, 5];
      assert.strictEqual(arr.product(), 120);
    });

    it("should return 1 for empty array", () => {
      const arr: number[] = [];
      assert.strictEqual(arr.product(), 1);
    });

    it("should handle negative numbers", () => {
      const arr = [-1, -2, -4];
      assert.strictEqual(arr.product(), -8);
    });

    it("should handle mixed positive and negative", () => {
      const arr = [10, -5, 3, -2];
      assert.strictEqual(arr.product(), 300);
    });

    it("should handle decimals", () => {
      const arr = [1.5, 2.5, 3.5];
      assert.strictEqual(arr.product(), 13.125);
    });

    it("should throw on non-numeric values", () => {
      const arr = [1, 2, "3" as any, 4];
      assert.throws(() => arr.product(), {
        name: "TypeError",
        message: "Array contains non-numeric values",
      });
    });

    it("should handle single element", () => {
      const arr = [42];
      assert.strictEqual(arr.product(), 42);
    });

    it("should handle zeros", () => {
      const arr = [0, 0, 0];
      assert.strictEqual(arr.product(), 0);
    });
  });

  describe("unique", () => {
    it("should remove duplicates using key function", () => {
      const arr = [{ key: "a" }, { key: "b" }, { key: "a" }];
      const result = arr.unique();
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].key, "a");
      assert.strictEqual(result[1].key, "b");
    });

    it("should use custom key function", () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
      const result = arr.unique((x) => x.id.toString());
      assert.strictEqual(result.length, 2);
    });

    it("should handle empty array", () => {
      const arr: any[] = [];
      const result = arr.unique();
      assert.strictEqual(result.length, 0);
    });

    it("should preserve order of first occurrence", () => {
      const arr = [{ key: "c" }, { key: "a" }, { key: "b" }, { key: "a" }];
      const result = arr.unique();
      assert.strictEqual(result[0].key, "c");
      assert.strictEqual(result[1].key, "a");
      assert.strictEqual(result[2].key, "b");
    });

    it("should handle all unique elements", () => {
      const arr = [{ key: "a" }, { key: "b" }, { key: "c" }];
      const result = arr.unique();
      assert.strictEqual(result.length, 3);
    });

    it("should handle all duplicate elements", () => {
      const arr = [{ key: "a" }, { key: "a" }, { key: "a" }];
      const result = arr.unique();
      assert.strictEqual(result.length, 1);
    });

    it("should throw if key function returns falsy", () => {
      const arr = [{ key: "" }, { key: "b" }];
      assert.throws(() => arr.unique(), {
        message: "unique requires a key function",
      });
    });

    it("should work with string keys", () => {
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
    it("should map and filter out nulls", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = arr.mapNotNull((x) => (x > 3 ? x * 2 : null));
      assert.deepStrictEqual(result, [8, 10]);
    });

    it("should handle all nulls", () => {
      const arr = [1, 2, 3];
      const result = arr.mapNotNull((x) => null);
      assert.deepStrictEqual(result, []);
    });

    it("should handle no nulls", () => {
      const arr = [1, 2, 3];
      const result = arr.mapNotNull((x) => x * 2);
      assert.deepStrictEqual(result, [2, 4, 6]);
    });

    it("should handle empty array", () => {
      const arr: number[] = [];
      const result = arr.mapNotNull((x) => x * 2);
      assert.deepStrictEqual(result, []);
    });

    it("should change types correctly", () => {
      const arr = [1, 2, 3];
      const result = arr.mapNotNull((x) => (x > 2 ? x.toString() : null));
      assert.deepStrictEqual(result, ["3"]);
    });

    it("should handle complex transformations", () => {
      const arr = ["a", "b", "c"];
      const result = arr.mapNotNull((s) => (s === "b" ? null : s.toUpperCase()));
      assert.deepStrictEqual(result, ["A", "C"]);
    });

    it("should pass index to mapping function", () => {
      const arr = [10, 20, 30, 40, 50];
      const result = arr.mapNotNull((x, i) => i);
      assert.deepStrictEqual(result, [0, 1, 2, 3, 4]);
    });

    it("should use index to conditionally return null", () => {
      const arr = ["a", "b", "c", "d", "e"];
      const result = arr.mapNotNull((s, i) => (i % 2 === 0 ? s.toUpperCase() : null));
      assert.deepStrictEqual(result, ["A", "C", "E"]);
    });

    it("should work with both value and index in transformation", () => {
      const arr = [5, 10, 15, 20];
      const result = arr.mapNotNull((x, i) => (x > 10 ? `${x}-${i}` : null));
      assert.deepStrictEqual(result, ["15-2", "20-3"]);
    });
  });

  describe("equalsArray", () => {
    it("should return true for equal arrays", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 3];
      assert.strictEqual(arr1.equalsArray(arr2), true);
    });

    it("should return false for different lengths", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2];
      assert.strictEqual(arr1.equalsArray(arr2), false);
    });

    it("should return false for different values", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [1, 2, 4];
      assert.strictEqual(arr1.equalsArray(arr2), false);
    });

    it("should return true for empty arrays", () => {
      const arr1: number[] = [];
      const arr2: number[] = [];
      assert.strictEqual(arr1.equalsArray(arr2), true);
    });

    it("should handle string arrays", () => {
      const arr1 = ["a", "b", "c"];
      const arr2 = ["a", "b", "c"];
      assert.strictEqual(arr1.equalsArray(arr2), true);
    });

    it("should use strict equality", () => {
      const arr1 = [1, 2, 3];
      const arr2 = ["1", "2", "3"] as any;
      assert.strictEqual(arr1.equalsArray(arr2), false);
    });

    it("should handle single element", () => {
      const arr1 = [1];
      const arr2 = [1];
      assert.strictEqual(arr1.equalsArray(arr2), true);
    });

    it("should be order-sensitive", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [3, 2, 1];
      assert.strictEqual(arr1.equalsArray(arr2), false);
    });

    it("should handle object references", () => {
      const obj = { x: 1 };
      const arr1 = [obj];
      const arr2 = [obj];
      assert.strictEqual(arr1.equalsArray(arr2), true);
    });

    it("should not deep compare objects", () => {
      const arr1 = [{ x: 1 }];
      const arr2 = [{ x: 1 }];
      assert.strictEqual(arr1.equalsArray(arr2), false);
    });
  });

  describe("findOne", () => {
    it("should return the single matching element", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = arr.findOne((x) => x === 3);
      assert.strictEqual(result, 3);
    });

    it("should throw when no elements match", () => {
      const arr = [1, 2, 3];
      assert.throws(() => arr.findOne((x) => x > 10), {
        message: "Could not find item",
      });
    });

    it("should throw when multiple elements match", () => {
      const arr = [1, 2, 3, 4, 5];
      assert.throws(() => arr.findOne((x) => x > 3), {
        message: "Found more than one item",
      });
    });

    it("should throw on empty array", () => {
      const arr: number[] = [];
      assert.throws(() => arr.findOne((x) => x > 0), {
        message: "Could not find item",
      });
    });

    it("should work with object arrays", () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = arr.findOne((obj) => obj.id === 2);
      assert.deepStrictEqual(result, { id: 2 });
    });

    it("should work with string arrays", () => {
      const arr = ["foo", "bar", "baz"];
      const result = arr.findOne((s) => s.startsWith("ba") && s.endsWith("r"));
      assert.strictEqual(result, "bar");
    });

    it("should work with single element array when it matches", () => {
      const arr = [42];
      const result = arr.findOne((x) => x === 42);
      assert.strictEqual(result, 42);
    });

    it("should throw with single element array when it doesn't match", () => {
      const arr = [42];
      assert.throws(() => arr.findOne((x) => x === 99), {
        message: "Could not find item",
      });
    });

    it("should work with complex predicates", () => {
      const arr = [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
        { name: "Charlie", age: 35 },
      ];
      const result = arr.findOne((person) => person.name.startsWith("B") && person.age === 30);
      assert.deepStrictEqual(result, { name: "Bob", age: 30 });
    });

    it("should throw when two elements match", () => {
      const arr = [1, 2, 3, 4];
      assert.throws(() => arr.findOne((x) => x % 2 === 0), {
        message: "Found more than one item",
      });
    });

    it("should return first element if it's the only match", () => {
      const arr = [5, 2, 3, 4];
      const result = arr.findOne((x) => x === 5);
      assert.strictEqual(result, 5);
    });

    it("should return last element if it's the only match", () => {
      const arr = [1, 2, 3, 5];
      const result = arr.findOne((x) => x === 5);
      assert.strictEqual(result, 5);
    });
  });

  describe("transpose", () => {
    it("transposes a square 2D array", () => {
      const arr = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const result = arr.transpose();
      const expected = [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
      ];
      assert.deepStrictEqual(result, expected);
    });

    it("transposes a vert rect 2D array", () => {
      const arr = [
        [1, 2],
        [4, 5],
        [7, 8],
      ];
      const result = arr.transpose();
      const expected = [
        [1, 4, 7],
        [2, 5, 8],
      ];
      assert.deepStrictEqual(result, expected);
    });

    it("transposes a horz 2D array", () => {
      const arr = [
        [1, 2, 3],
        [4, 5, 6],
      ];
      const result = arr.transpose();
      const expected = [
        [1, 4],
        [2, 5],
        [3, 6],
      ];
      assert.deepStrictEqual(result, expected);
    });

    it("Throws when not a 2d array", () => {
      const arr = [1, 2, 3];
      assert.throws(() => arr.transpose(), {
        message: "transpose requires a 2D array",
      });
    });
  });

  describe("groupBy", () => {
    it("groups elements by key function", () => {
      const items = [
        {
          type: "fruit",
          name: "apple",
        },
        {
          type: "vegetable",
          name: "carrot",
        },
        {
          type: "fruit",
          name: "banana",
        },
      ];

      const grouped = items.groupBy((item) => item.type);
      assert.strictEqual(grouped.size, 2);
      assert.deepStrictEqual(grouped.get("fruit"), [
        {
          type: "fruit",
          name: "apple",
        },
        {
          type: "fruit",
          name: "banana",
        },
      ]);
    });

    it("empty group", () => {
      const grouped = [].groupBy(() => 0);
      assert.strictEqual(grouped.size, 0);
    });
  });
});
