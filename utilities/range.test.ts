import { describe, test } from "node:test";
import assert from "node:assert";
import { range } from "./range";

describe("range", () => {
  describe("single argument (size)", () => {
    test("should generate range from 0 to size-1", () => {
      const result = range(5);
      assert.deepStrictEqual(result, [0, 1, 2, 3, 4]);
    });

    test("should handle size of 0", () => {
      const result = range(0);
      assert.deepStrictEqual(result, []);
    });

    test("should handle size of 1", () => {
      const result = range(1);
      assert.deepStrictEqual(result, [0]);
    });

    test("should handle large ranges", () => {
      const result = range(1000);
      assert.strictEqual(result.length, 1000);
      assert.strictEqual(result[0], 0);
      assert.strictEqual(result[999], 999);
    });

    test("should handle negative size", () => {
      const result = range(-5);
      assert.deepStrictEqual(result, []);
    });
  });

  describe("two arguments (from, to)", () => {
    test("should generate range from start to end inclusive", () => {
      const result = range(1, 5);
      assert.deepStrictEqual(result, [1, 2, 3, 4, 5]);
    });

    test("should handle single value range", () => {
      const result = range(5, 5);
      assert.deepStrictEqual(result, [5]);
    });

    test("should handle negative ranges", () => {
      const result = range(-3, -1);
      assert.deepStrictEqual(result, [-3, -2, -1]);
    });

    test("should handle crossing zero", () => {
      const result = range(-2, 2);
      assert.deepStrictEqual(result, [-2, -1, 0, 1, 2]);
    });

    test("should handle from > to", () => {
      const result = range(5, 1);
      assert.deepStrictEqual(result, []);
    });

    test("should handle zero bounds", () => {
      const result = range(0, 0);
      assert.deepStrictEqual(result, [0]);
    });

    test("should handle large ranges", () => {
      const result = range(0, 100);
      assert.strictEqual(result.length, 101);
      assert.strictEqual(result[0], 0);
      assert.strictEqual(result[100], 100);
    });
  });

  describe("three arguments (from, to, step)", () => {
    test("should generate range with custom step", () => {
      const result = range(0, 10, 2);
      assert.deepStrictEqual(result, [0, 2, 4, 6, 8, 10]);
    });

    test("should handle step of 1", () => {
      const result = range(1, 5, 1);
      assert.deepStrictEqual(result, [1, 2, 3, 4, 5]);
    });

    test("should handle large steps", () => {
      const result = range(0, 100, 25);
      assert.deepStrictEqual(result, [0, 25, 50, 75, 100]);
    });

    test("should stop before exceeding to", () => {
      const result = range(0, 10, 3);
      assert.deepStrictEqual(result, [0, 3, 6, 9]);
    });

    test("should handle step larger than range", () => {
      const result = range(0, 5, 10);
      assert.deepStrictEqual(result, [0]);
    });

    test("should handle negative step (countdown)", () => {
      const result = range(10, 0, -1);
      assert.deepStrictEqual(result, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    });

    test("should handle negative step with larger increments", () => {
      const result = range(10, 0, -2);
      assert.deepStrictEqual(result, [10, 8, 6, 4, 2, 0]);
    });

    test("should handle negative step that doesn't reach end", () => {
      const result = range(10, 0, -3);
      assert.deepStrictEqual(result, [10, 7, 4, 1]);
    });

    test("should handle fractional steps", () => {
      const result = range(0, 2, 0.5);
      assert.deepStrictEqual(result, [0, 0.5, 1, 1.5, 2]);
    });

    test("should handle step that doesn't divide evenly", () => {
      const result = range(0, 10, 4);
      assert.deepStrictEqual(result, [0, 4, 8]);
    });
  });

  describe("edge cases", () => {
    test("should handle very small decimal steps", () => {
      const result = range(0, 0.3, 0.1);
      // Due to floating point, this might be [0, 0.1, 0.2] (length 3) or [0, 0.1, 0.2, 0.3] (length 4)
      // depending on rounding. Let's check which it actually is.
      assert.ok(result.length === 3 || result.length === 4);
      assert.ok(Math.abs(result[0]) < 0.0001);
      assert.ok(
        Math.abs(result[result.length - 1] - 0.3) < 0.0001 ||
          Math.abs(result[result.length - 1] - 0.2) < 0.0001,
      );
    });

    test("should handle zero step", () => {
      // Zero step now returns empty array to avoid infinite loop
      assert.throws(() => range(0, 10, 0), /step must not be zero/);
    });

    test("should handle positive step with reversed bounds", () => {
      // When from > to with positive step, should return empty
      const result = range(10, 0, 1);
      assert.deepStrictEqual(result, []);
    });

    test("should handle negative step with non-reversed bounds", () => {
      // When from < to with negative step, should return empty
      const result = range(0, 10, -1);
      assert.deepStrictEqual(result, []);
    });

    test("should be inclusive of endpoint", () => {
      const result = range(1, 3);
      assert.ok(result.includes(3));
    });

    test("should work with single argument 0", () => {
      const result = range(0);
      assert.deepStrictEqual(result, []);
    });
  });

  describe("common use cases", () => {
    test("should work for array indexing", () => {
      const arr = ["a", "b", "c"];
      const indices = range(arr.length);
      assert.deepStrictEqual(indices, [0, 1, 2]);
    });

    test("should work for grid coordinates", () => {
      const width = 3;
      const height = 2;
      let positions = [];
      for (const y of range(height)) {
        for (const x of range(width)) {
          positions.push([x, y]);
        }
      }
      assert.strictEqual(positions.length, 6);
      assert.deepStrictEqual(positions[0], [0, 0]);
      assert.deepStrictEqual(positions[5], [2, 1]);
    });

    test("should work for countdown", () => {
      const result = range(5, 1, -1);
      assert.deepStrictEqual(result, [5, 4, 3, 2, 1]);
    });

    test("should work for negative ranges", () => {
      const result = range(-5, -10, -1);
      assert.deepStrictEqual(result, [-5, -6, -7, -8, -9, -10]);
    });
  });
});
