import { describe, it } from "node:test";
import assert from "node:assert";
import "./stringExtensions";

describe("String extensions", () => {
  describe("lines", () => {
    it("should split string into lines", () => {
      const str = "foo\nbar\nbaz";
      const result = str.lines();
      assert.deepStrictEqual(result, ["foo", "bar", "baz"]);
    });

    it("should handle single line", () => {
      const str = "foo";
      const result = str.lines();
      assert.deepStrictEqual(result, ["foo"]);
    });

    it("should handle empty string", () => {
      const str = "";
      const result = str.lines();
      assert.deepStrictEqual(result, [""]);
    });

    it("should handle trailing newline", () => {
      const str = "foo\nbar\n";
      const result = str.lines();
      assert.deepStrictEqual(result, ["foo", "bar", ""]);
    });

    it("should handle leading newline", () => {
      const str = "\nfoo\nbar";
      const result = str.lines();
      assert.deepStrictEqual(result, ["", "foo", "bar"]);
    });

    it("should handle multiple consecutive newlines", () => {
      const str = "foo\n\n\nbar";
      const result = str.lines();
      assert.deepStrictEqual(result, ["foo", "", "", "bar"]);
    });

    it("should handle only newlines", () => {
      const str = "\n\n\n";
      const result = str.lines();
      assert.deepStrictEqual(result, ["", "", "", ""]);
    });

    it("should preserve empty lines", () => {
      const str = "a\n\nb";
      const result = str.lines();
      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[1], "");
    });

    it("should handle very long lines", () => {
      const longLine = "a".repeat(10000);
      const str = `${longLine}\n${longLine}`;
      const result = str.lines();
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].length, 10000);
    });
  });

  describe("chars", () => {
    it("should split string into characters", () => {
      const str = "abc";
      const result = str.chars();
      assert.deepStrictEqual(result, ["a", "b", "c"]);
    });

    it("should handle single character", () => {
      const str = "a";
      const result = str.chars();
      assert.deepStrictEqual(result, ["a"]);
    });

    it("should handle empty string", () => {
      const str = "";
      const result = str.chars();
      assert.deepStrictEqual(result, []);
    });

    it("should handle special characters", () => {
      const str = "!@#";
      const result = str.chars();
      assert.deepStrictEqual(result, ["!", "@", "#"]);
    });

    it("should handle spaces", () => {
      const str = "a b c";
      const result = str.chars();
      assert.deepStrictEqual(result, ["a", " ", "b", " ", "c"]);
    });

    it("should handle numbers", () => {
      const str = "123";
      const result = str.chars();
      assert.deepStrictEqual(result, ["1", "2", "3"]);
    });

    it("should handle newlines", () => {
      const str = "a\nb";
      const result = str.chars();
      assert.deepStrictEqual(result, ["a", "\n", "b"]);
    });

    it("should handle unicode characters", () => {
      const str = "👍🎉";
      const result = str.chars();
      // Note: emoji are split into surrogate pairs
      assert.strictEqual(result.length, 4);
    });

    it("should handle tabs", () => {
      const str = "a\tb";
      const result = str.chars();
      assert.deepStrictEqual(result, ["a", "\t", "b"]);
    });

    it("should handle mixed characters", () => {
      const str = "aB1!";
      const result = str.chars();
      assert.deepStrictEqual(result, ["a", "B", "1", "!"]);
    });
  });

  describe("integration", () => {
    it("should work together for grid parsing", () => {
      const str = "abc\ndef\nghi";
      const grid = str.lines().map((line) => line.chars());
      assert.strictEqual(grid.length, 3);
      assert.strictEqual(grid[0].length, 3);
      assert.strictEqual(grid[0][0], "a");
      assert.strictEqual(grid[2][2], "i");
    });

    it("should handle empty lines in grid", () => {
      const str = "abc\n\ndef";
      const grid = str.lines().map((line) => line.chars());
      assert.strictEqual(grid.length, 3);
      assert.strictEqual(grid[1].length, 0);
    });
  });

  describe("toInt", () => {
    it("should convert valid integer string to number", () => {
      assert.strictEqual("0".toInt(), 0);
      assert.strictEqual("1".toInt(), 1);
      assert.strictEqual("-10".toInt(), -10);
      assert.strictEqual("123".toInt(), 123);
    });

    it("Throws for non int values", () => {
      assert.throws(() => "abc".toInt(), /is not made up of only base10 number characters/);
      assert.throws(() => "12.34".toInt(), /is not made up of only base10 number characters/);
      assert.throws(() => "".toInt(), /is not made up of only base10 number characters/);
      assert.throws(() => " ".toInt(), /is not made up of only base10 number characters/);
      assert.throws(() => "123abc".toInt(), /is not made up of only base10 number characters/);
      assert.throws(() => "-123-123".toInt(), /is not made up of only base10 number characters/);
    });
  });
});
