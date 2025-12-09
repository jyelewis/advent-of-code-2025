import { describe, it } from "node:test";
import assert from "node:assert";
import { Position } from "./Position";
import { Direction } from "./Direction";

describe("Position", () => {
  describe("constructor", () => {
    it("should create position with x and y", () => {
      const pos = new Position(5, 10);
      assert.strictEqual(pos.x, 5);
      assert.strictEqual(pos.y, 10);
    });

    it("should handle negative coordinates", () => {
      const pos = new Position(-5, -10);
      assert.strictEqual(pos.x, -5);
      assert.strictEqual(pos.y, -10);
    });

    it("should handle zero coordinates", () => {
      const pos = new Position(0, 0);
      assert.strictEqual(pos.x, 0);
      assert.strictEqual(pos.y, 0);
    });
  });

  describe("key", () => {
    it("should generate unique key for position", () => {
      const pos = new Position(5, 10);
      assert.strictEqual(pos.key, "5,10");
    });

    it("should generate key for negative positions", () => {
      const pos = new Position(-5, -10);
      assert.strictEqual(pos.key, "-5,-10");
    });

    it("should generate unique keys for different positions", () => {
      const pos1 = new Position(1, 2);
      const pos2 = new Position(2, 1);
      assert.notStrictEqual(pos1.key, pos2.key);
    });
  });

  describe("equals", () => {
    it("should return true for same position", () => {
      const pos1 = new Position(5, 10);
      const pos2 = new Position(5, 10);
      assert.strictEqual(pos1.equals(pos2), true);
    });

    it("should return false for different x", () => {
      const pos1 = new Position(5, 10);
      const pos2 = new Position(6, 10);
      assert.strictEqual(pos1.equals(pos2), false);
    });

    it("should return false for different y", () => {
      const pos1 = new Position(5, 10);
      const pos2 = new Position(5, 11);
      assert.strictEqual(pos1.equals(pos2), false);
    });

    it("should work with negative coordinates", () => {
      const pos1 = new Position(-5, -10);
      const pos2 = new Position(-5, -10);
      assert.strictEqual(pos1.equals(pos2), true);
    });
  });

  describe("move", () => {
    it("should move UP by 1 step", () => {
      const pos = new Position(5, 5);
      const newPos = pos.move(Direction.UP);
      assert.strictEqual(newPos.x, 5);
      assert.strictEqual(newPos.y, 4);
    });

    it("should move DOWN by 1 step", () => {
      const pos = new Position(5, 5);
      const newPos = pos.move(Direction.DOWN);
      assert.strictEqual(newPos.x, 5);
      assert.strictEqual(newPos.y, 6);
    });

    it("should move LEFT by 1 step", () => {
      const pos = new Position(5, 5);
      const newPos = pos.move(Direction.LEFT);
      assert.strictEqual(newPos.x, 4);
      assert.strictEqual(newPos.y, 5);
    });

    it("should move RIGHT by 1 step", () => {
      const pos = new Position(5, 5);
      const newPos = pos.move(Direction.RIGHT);
      assert.strictEqual(newPos.x, 6);
      assert.strictEqual(newPos.y, 5);
    });

    it("should move UP_LEFT diagonally", () => {
      const pos = new Position(5, 5);
      const newPos = pos.move(Direction.UP_LEFT);
      assert.strictEqual(newPos.x, 4);
      assert.strictEqual(newPos.y, 4);
    });

    it("should move UP_RIGHT diagonally", () => {
      const pos = new Position(5, 5);
      const newPos = pos.move(Direction.UP_RIGHT);
      assert.strictEqual(newPos.x, 6);
      assert.strictEqual(newPos.y, 4);
    });

    it("should move DOWN_LEFT diagonally", () => {
      const pos = new Position(5, 5);
      const newPos = pos.move(Direction.DOWN_LEFT);
      assert.strictEqual(newPos.x, 4);
      assert.strictEqual(newPos.y, 6);
    });

    it("should move DOWN_RIGHT diagonally", () => {
      const pos = new Position(5, 5);
      const newPos = pos.move(Direction.DOWN_RIGHT);
      assert.strictEqual(newPos.x, 6);
      assert.strictEqual(newPos.y, 6);
    });

    it("should move multiple steps", () => {
      const pos = new Position(5, 5);
      const newPos = pos.move(Direction.UP, 3);
      assert.strictEqual(newPos.x, 5);
      assert.strictEqual(newPos.y, 2);
    });

    it("should move negative steps (backwards)", () => {
      const pos = new Position(5, 5);
      const newPos = pos.move(Direction.UP, -2);
      assert.strictEqual(newPos.x, 5);
      assert.strictEqual(newPos.y, 7);
    });

    it("should not mutate original position", () => {
      const pos = new Position(5, 5);
      pos.move(Direction.UP, 10);
      assert.strictEqual(pos.x, 5);
      assert.strictEqual(pos.y, 5);
    });
  });

  describe("toString", () => {
    it("should format position as string", () => {
      const pos = new Position(5, 10);
      assert.strictEqual(pos.toString(), "[x:5; y:10]");
    });

    it("should format negative positions", () => {
      const pos = new Position(-5, -10);
      assert.strictEqual(pos.toString(), "[x:-5; y:-10]");
    });
  });

  describe("isAdjacentTo", () => {
    it("should return true for position directly above", () => {
      const pos1 = new Position(5, 5);
      const pos2 = new Position(5, 4);
      assert.strictEqual(pos1.isAdjacentTo(pos2), true);
    });

    it("should return true for position directly below", () => {
      const pos1 = new Position(5, 5);
      const pos2 = new Position(5, 6);
      assert.strictEqual(pos1.isAdjacentTo(pos2), true);
    });

    it("should return true for position to the left", () => {
      const pos1 = new Position(5, 5);
      const pos2 = new Position(4, 5);
      assert.strictEqual(pos1.isAdjacentTo(pos2), true);
    });

    it("should return true for position to the right", () => {
      const pos1 = new Position(5, 5);
      const pos2 = new Position(6, 5);
      assert.strictEqual(pos1.isAdjacentTo(pos2), true);
    });

    it("should return false for diagonal positions", () => {
      const pos1 = new Position(5, 5);
      const pos2 = new Position(4, 4);
      assert.strictEqual(pos1.isAdjacentTo(pos2), false);
    });

    it("should return false for same position", () => {
      const pos1 = new Position(5, 5);
      const pos2 = new Position(5, 5);
      assert.strictEqual(pos1.isAdjacentTo(pos2), false);
    });

    it("should return false for distant positions", () => {
      const pos1 = new Position(5, 5);
      const pos2 = new Position(10, 10);
      assert.strictEqual(pos1.isAdjacentTo(pos2), false);
    });
  });

  describe("manhattanDistanceTo", () => {
    it("should calculate distance for same position", () => {
      const pos1 = new Position(5, 5);
      const pos2 = new Position(5, 5);
      assert.strictEqual(pos1.manhattanDistanceTo(pos2), 0);
    });

    it("should calculate distance horizontally", () => {
      const pos1 = new Position(0, 0);
      const pos2 = new Position(5, 0);
      assert.strictEqual(pos1.manhattanDistanceTo(pos2), 5);
    });

    it("should calculate distance vertically", () => {
      const pos1 = new Position(0, 0);
      const pos2 = new Position(0, 5);
      assert.strictEqual(pos1.manhattanDistanceTo(pos2), 5);
    });

    it("should calculate distance diagonally", () => {
      const pos1 = new Position(0, 0);
      const pos2 = new Position(3, 4);
      assert.strictEqual(pos1.manhattanDistanceTo(pos2), 7);
    });

    it("should calculate distance with negative coordinates", () => {
      const pos1 = new Position(-5, -5);
      const pos2 = new Position(5, 5);
      assert.strictEqual(pos1.manhattanDistanceTo(pos2), 20);
    });

    it("should be symmetric", () => {
      const pos1 = new Position(1, 2);
      const pos2 = new Position(5, 8);
      assert.strictEqual(pos1.manhattanDistanceTo(pos2), pos2.manhattanDistanceTo(pos1));
    });
  });

  describe("direction helper methods", () => {
    it("left() should move left", () => {
      const pos = new Position(5, 5);
      const newPos = pos.left();
      assert.strictEqual(newPos.x, 4);
      assert.strictEqual(newPos.y, 5);
    });

    it("right() should move right", () => {
      const pos = new Position(5, 5);
      const newPos = pos.right();
      assert.strictEqual(newPos.x, 6);
      assert.strictEqual(newPos.y, 5);
    });

    it("up() should move up", () => {
      const pos = new Position(5, 5);
      const newPos = pos.up();
      assert.strictEqual(newPos.x, 5);
      assert.strictEqual(newPos.y, 4);
    });

    it("down() should move down", () => {
      const pos = new Position(5, 5);
      const newPos = pos.down();
      assert.strictEqual(newPos.x, 5);
      assert.strictEqual(newPos.y, 6);
    });

    it("upLeft() should move up and left", () => {
      const pos = new Position(5, 5);
      const newPos = pos.upLeft();
      assert.strictEqual(newPos.x, 4);
      assert.strictEqual(newPos.y, 4);
    });

    it("upRight() should move up and right", () => {
      const pos = new Position(5, 5);
      const newPos = pos.upRight();
      assert.strictEqual(newPos.x, 6);
      assert.strictEqual(newPos.y, 4);
    });

    it("downLeft() should move down and left", () => {
      const pos = new Position(5, 5);
      const newPos = pos.downLeft();
      assert.strictEqual(newPos.x, 4);
      assert.strictEqual(newPos.y, 6);
    });

    it("downRight() should move down and right", () => {
      const pos = new Position(5, 5);
      const newPos = pos.downRight();
      assert.strictEqual(newPos.x, 6);
      assert.strictEqual(newPos.y, 6);
    });
  });
});
