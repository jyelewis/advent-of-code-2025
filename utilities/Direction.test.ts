import { describe, it } from "node:test";
import assert from "node:assert";
import { Direction } from "./Direction";

describe("Direction", () => {
  describe("rotate90CW", () => {
    it("should rotate UP to RIGHT", () => {
      assert.deepStrictEqual(Direction.UP.rotate90CW(), Direction.RIGHT);
    });
    it("should rotate RIGHT to DOWN", () => {
      assert.deepStrictEqual(Direction.RIGHT.rotate90CW(), Direction.DOWN);
    });
    it("should rotate DOWN to LEFT", () => {
      assert.deepStrictEqual(Direction.DOWN.rotate90CW(), Direction.LEFT);
    });
    it("should rotate LEFT to UP", () => {
      assert.deepStrictEqual(Direction.LEFT.rotate90CW(), Direction.UP);
    });
    it("should throw for non-cardinal directions", () => {
      assert.throws(() => Direction.UP_LEFT.rotate90CW(), /Cannot rotate non-cardinal direction/);
    });
  });

  describe("rotate90CCW", () => {
    it("should rotate UP to LEFT", () => {
      assert.deepStrictEqual(Direction.UP.rotate90CCW(), Direction.LEFT);
    });
    it("should rotate LEFT to DOWN", () => {
      assert.deepStrictEqual(Direction.LEFT.rotate90CCW(), Direction.DOWN);
    });
    it("should rotate DOWN to RIGHT", () => {
      assert.deepStrictEqual(Direction.DOWN.rotate90CCW(), Direction.RIGHT);
    });
    it("should rotate RIGHT to UP", () => {
      assert.deepStrictEqual(Direction.RIGHT.rotate90CCW(), Direction.UP);
    });
    it("should throw for non-cardinal directions", () => {
      assert.throws(() => Direction.UP_LEFT.rotate90CCW(), /Cannot rotate non-cardinal direction/);
    });
  });
});
