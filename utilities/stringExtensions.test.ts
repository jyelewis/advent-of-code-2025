import { describe, test } from "node:test";
import assert from "node:assert";
import "./stringExtensions";

describe("String extensions", () => {
  describe("lines", () => {
    test("should split string into lines", () => {
      const str = "foo\nbar\nbaz";
      const result = str.lines();
      assert.deepStrictEqual(result, ["foo", "bar", "baz"]);
    });

    test("should handle single line", () => {
      const str = "foo";
      const result = str.lines();
      assert.deepStrictEqual(result, ["foo"]);
    });

    test("should handle empty string", () => {
      const str = "";
      const result = str.lines();
      assert.deepStrictEqual(result, [""]);
    });

    test("should handle trailing newline", () => {
      const str = "foo\nbar\n";
      const result = str.lines();
      assert.deepStrictEqual(result, ["foo", "bar", ""]);
    });

    test("should handle leading newline", () => {
      const str = "\nfoo\nbar";
      const result = str.lines();
      assert.deepStrictEqual(result, ["", "foo", "bar"]);
    });

    test("should handle multiple consecutive newlines", () => {
      const str = "foo\n\n\nbar";
      const result = str.lines();
      assert.deepStrictEqual(result, ["foo", "", "", "bar"]);
    });

    test("should handle only newlines", () => {
      const str = "\n\n\n";
      const result = str.lines();
      assert.deepStrictEqual(result, ["", "", "", ""]);
    });

    test("should preserve empty lines", () => {
      const str = "a\n\nb";
      const result = str.lines();
      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[1], "");
    });

    test("should handle very long lines", () => {
      const longLine = "a".repeat(10000);
      const str = `${longLine}\n${longLine}`;
      const result = str.lines();
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].length, 10000);
    });
  });

  describe("chars", () => {
    test("should split string into characters", () => {
      const str = "abc";
      const result = str.chars();
      assert.deepStrictEqual(result, ["a", "b", "c"]);
    });

    test("should handle single character", () => {
      const str = "a";
      const result = str.chars();
      assert.deepStrictEqual(result, ["a"]);
    });

    test("should handle empty string", () => {
      const str = "";
      const result = str.chars();
      assert.deepStrictEqual(result, []);
    });

    test("should handle special characters", () => {
      const str = "!@#";
      const result = str.chars();
      assert.deepStrictEqual(result, ["!", "@", "#"]);
    });

    test("should handle spaces", () => {
      const str = "a b c";
      const result = str.chars();
      assert.deepStrictEqual(result, ["a", " ", "b", " ", "c"]);
    });

    test("should handle numbers", () => {
      const str = "123";
      const result = str.chars();
      assert.deepStrictEqual(result, ["1", "2", "3"]);
    });

    test("should handle newlines", () => {
      const str = "a\nb";
      const result = str.chars();
      assert.deepStrictEqual(result, ["a", "\n", "b"]);
    });

    test("should handle unicode characters", () => {
      const str = "👍🎉";
      const result = str.chars();
      // Note: emoji are split into surrogate pairs
      assert.strictEqual(result.length, 4);
    });

    test("should handle tabs", () => {
      const str = "a\tb";
      const result = str.chars();
      assert.deepStrictEqual(result, ["a", "\t", "b"]);
    });

    test("should handle mixed characters", () => {
      const str = "aB1!";
      const result = str.chars();
      assert.deepStrictEqual(result, ["a", "B", "1", "!"]);
    });
  });

  describe("integration", () => {
    test("should work together for grid parsing", () => {
      const str = "abc\ndef\nghi";
      const grid = str.lines().map((line) => line.chars());
      assert.strictEqual(grid.length, 3);
      assert.strictEqual(grid[0].length, 3);
      assert.strictEqual(grid[0][0], "a");
      assert.strictEqual(grid[2][2], "i");
    });

    test("should handle empty lines in grid", () => {
      const str = "abc\n\ndef";
      const grid = str.lines().map((line) => line.chars());
      assert.strictEqual(grid.length, 3);
      assert.strictEqual(grid[1].length, 0);
    });
  });
});
