import { describe, it } from "node:test";
import assert from "node:assert";
import { parse2DArray } from "./parse2DArray";
import "./stringExtensions";

describe("parse2DArray", () => {
  describe("basic functionality", () => {
    it("should parse simple number grid", () => {
      const input = "1 2 3\n4 5 6";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });

    it("should parse single row", () => {
      const input = "1 2 3";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[1, 2, 3]]);
    });

    it("should parse single column", () => {
      const input = "1\n2\n3";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[1], [2], [3]]);
    });

    it("should parse single number", () => {
      const input = "42";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[42]]);
    });
  });

  describe("different delimiters", () => {
    it("should handle comma-separated values", () => {
      const input = "1,2,3\n4,5,6";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });

    it("should handle tab-separated values", () => {
      const input = "1\t2\t3\n4\t5\t6";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });

    it("should handle multiple spaces", () => {
      const input = "1   2   3\n4   5   6";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });

    it("should handle mixed delimiters", () => {
      const input = "1, 2\t3\n4 5, 6";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });

    it("should handle other punctuation", () => {
      const input = "1|2:3;4/5";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[1, 2, 3, 4, 5]]);
    });
  });

  describe("negative numbers", () => {
    it("should parse negative numbers", () => {
      const input = "-1 -2 -3\n-4 -5 -6";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [
        [-1, -2, -3],
        [-4, -5, -6],
      ]);
    });

    it("should handle mixed positive and negative", () => {
      const input = "1 -2 3\n-4 5 -6";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [
        [1, -2, 3],
        [-4, 5, -6],
      ]);
    });

    it("should handle negative with various delimiters", () => {
      const input = "-1,-2,-3";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[-1, -2, -3]]);
    });

    it("should handle ranges like '3-5'", () => {
      const input = "3-5";
      const result = parse2DArray(input);
      // The regex /[^-0-9]+/g splits on non-digit/non-minus characters
      // "3-5" has no such characters, so split gives ["3-5"]
      // parseInt("3-5") parses as 3 (stops at the minus in the middle)
      assert.deepStrictEqual(result, [[3]]);
    });
  });

  describe("edge cases", () => {
    it("should handle zero", () => {
      const input = "0 0 0";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[0, 0, 0]]);
    });

    it("should handle large numbers", () => {
      const input = "1000000 2000000";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[1000000, 2000000]]);
    });

    it("should filter out NaN from invalid input", () => {
      const input = "1 abc 2";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[1, 2]]);
    });

    it("should handle empty lines", () => {
      const input = "1 2 3\n\n4 5 6";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[1, 2, 3], [], [4, 5, 6]]);
    });

    it("should handle trailing newline", () => {
      const input = "1 2 3\n4 5 6\n";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[1, 2, 3], [4, 5, 6], []]);
    });

    it("should handle leading spaces", () => {
      const input = "  1 2 3\n  4 5 6";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });

    it("should handle trailing spaces", () => {
      const input = "1 2 3  \n4 5 6  ";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });
  });

  describe("real-world formats", () => {
    it("should parse coordinate pairs", () => {
      const input = "10,20\n30,40\n50,60";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [
        [10, 20],
        [30, 40],
        [50, 60],
      ]);
    });

    it("should parse grid with text labels", () => {
      const input = "a:1 b:2\nc:3 d:4";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [
        [1, 2],
        [3, 4],
      ]);
    });

    it("should parse numbers with units", () => {
      const input = "5m 10m 15m\n20m 25m 30m";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [
        [5, 10, 15],
        [20, 25, 30],
      ]);
    });

    it("should handle parentheses", () => {
      const input = "(1,2) (3,4)";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[1, 2, 3, 4]]);
    });
  });

  describe("empty/invalid input", () => {
    it("should handle empty string", () => {
      const input = "";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[]]);
    });

    it("should handle only whitespace", () => {
      const input = "   \n   ";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[], []]);
    });

    it("should handle only letters", () => {
      const input = "abc def";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[]]);
    });

    it("should handle special characters only", () => {
      const input = "!@# $%^";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[]]);
    });
  });

  describe("inconsistent row lengths", () => {
    it("should handle rows of different lengths", () => {
      const input = "1 2 3\n4 5\n6 7 8 9";
      const result = parse2DArray(input);
      assert.strictEqual(result[0].length, 3);
      assert.strictEqual(result[1].length, 2);
      assert.strictEqual(result[2].length, 4);
    });

    it("should handle some rows being empty", () => {
      const input = "1 2 3\nabc\n4 5 6";
      const result = parse2DArray(input);
      assert.deepStrictEqual(result, [[1, 2, 3], [], [4, 5, 6]]);
    });
  });
});
