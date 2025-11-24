import { describe, test } from "node:test";
import assert from "node:assert";
import { Grid, GridPosition } from "./Grid";
import { Position } from "./Position";
import { Direction } from "./Direction";
import "./stringExtensions";
import "./arrayExtensions";

describe("Grid", () => {
  describe("constructor", () => {
    test("should create grid from 2D array", () => {
      const grid = new Grid([
        [1, 2],
        [3, 4],
      ]);
      assert.strictEqual(grid.width, 2);
      assert.strictEqual(grid.height, 2);
    });

    test("should throw on empty array", () => {
      assert.throws(() => new Grid([]), {
        message: "items must be non empty",
      });
    });

    test("should throw on inconsistent row sizes", () => {
      assert.throws(() => new Grid([[1, 2], [3]]), {
        message: "Inconsistent row sizes",
      });
    });

    test("should handle single row", () => {
      const grid = new Grid([[1, 2, 3]]);
      assert.strictEqual(grid.width, 3);
      assert.strictEqual(grid.height, 1);
    });

    test("should handle single column", () => {
      const grid = new Grid([[1], [2], [3]]);
      assert.strictEqual(grid.width, 1);
      assert.strictEqual(grid.height, 3);
    });

    test("should handle large grids", () => {
      const items = Array(100)
        .fill(0)
        .map(() => Array(100).fill(0));
      const grid = new Grid(items);
      assert.strictEqual(grid.width, 100);
      assert.strictEqual(grid.height, 100);
    });
  });

  describe("fromSize", () => {
    test("should create grid with default value", () => {
      const grid = Grid.fromSize(3, 2, "x");
      assert.strictEqual(grid.width, 3);
      assert.strictEqual(grid.height, 2);
      assert.strictEqual(grid.items[0][0], "x");
      assert.strictEqual(grid.items[1][2], "x");
    });

    test("should create grid with null default", () => {
      const grid = Grid.fromSize(2, 2, null);
      assert.strictEqual(grid.items[0][0], null);
    });

    test("should create 1x1 grid", () => {
      const grid = Grid.fromSize(1, 1, 0);
      assert.strictEqual(grid.width, 1);
      assert.strictEqual(grid.height, 1);
    });
  });

  describe("fromString", () => {
    test("should create grid from string", () => {
      const grid = Grid.fromString("abc\ndef");
      assert.strictEqual(grid.width, 3);
      assert.strictEqual(grid.height, 2);
      assert.strictEqual(grid.items[0][0], "a");
      assert.strictEqual(grid.items[1][2], "f");
    });

    test("should handle single line", () => {
      const grid = Grid.fromString("abc");
      assert.strictEqual(grid.width, 3);
      assert.strictEqual(grid.height, 1);
    });

    test("should handle empty lines consistently", () => {
      const grid = Grid.fromString("\n\n");
      assert.strictEqual(grid.width, 0);
      assert.strictEqual(grid.height, 3);
    });
  });

  describe("positions", () => {
    test("should return all positions", () => {
      const grid = Grid.fromSize(2, 2, 0);
      const positions = grid.positions;
      assert.strictEqual(positions.length, 4);
    });

    test("should return positions in row-major order", () => {
      const grid = Grid.fromSize(2, 2, 0);
      const positions = grid.positions;
      assert.strictEqual(positions[0].x, 0);
      assert.strictEqual(positions[0].y, 0);
      assert.strictEqual(positions[1].x, 1);
      assert.strictEqual(positions[1].y, 0);
      assert.strictEqual(positions[2].x, 0);
      assert.strictEqual(positions[2].y, 1);
      assert.strictEqual(positions[3].x, 1);
      assert.strictEqual(positions[3].y, 1);
    });

    test("should return GridPosition objects", () => {
      const grid = Grid.fromSize(2, 2, 5);
      const positions = grid.positions;
      assert.ok(positions[0] instanceof GridPosition);
      assert.strictEqual(positions[0].value, 5);
    });
  });

  describe("isInBounds", () => {
    test("should return true for position inside grid", () => {
      const grid = Grid.fromSize(3, 3, 0);
      assert.strictEqual(grid.isInBounds(new Position(1, 1)), true);
    });

    test("should return true for corners", () => {
      const grid = Grid.fromSize(3, 3, 0);
      assert.strictEqual(grid.isInBounds(new Position(0, 0)), true);
      assert.strictEqual(grid.isInBounds(new Position(2, 0)), true);
      assert.strictEqual(grid.isInBounds(new Position(0, 2)), true);
      assert.strictEqual(grid.isInBounds(new Position(2, 2)), true);
    });

    test("should return false for negative x", () => {
      const grid = Grid.fromSize(3, 3, 0);
      assert.strictEqual(grid.isInBounds(new Position(-1, 1)), false);
    });

    test("should return false for negative y", () => {
      const grid = Grid.fromSize(3, 3, 0);
      assert.strictEqual(grid.isInBounds(new Position(1, -1)), false);
    });

    test("should return false for x >= width", () => {
      const grid = Grid.fromSize(3, 3, 0);
      assert.strictEqual(grid.isInBounds(new Position(3, 1)), false);
    });

    test("should return false for y >= height", () => {
      const grid = Grid.fromSize(3, 3, 0);
      assert.strictEqual(grid.isInBounds(new Position(1, 3)), false);
    });

    test("should return false for far out of bounds", () => {
      const grid = Grid.fromSize(3, 3, 0);
      assert.strictEqual(grid.isInBounds(new Position(100, 100)), false);
    });
  });

  describe("itemAt", () => {
    test("should return GridPosition at position", () => {
      const grid = Grid.fromSize(3, 3, "x");
      const item = grid.itemAt(new Position(1, 1));
      assert.ok(item instanceof GridPosition);
      assert.strictEqual(item.x, 1);
      assert.strictEqual(item.y, 1);
      assert.strictEqual(item.value, "x");
    });

    test("should throw for out of bounds position", () => {
      const grid = Grid.fromSize(3, 3, 0);
      assert.throws(() => grid.itemAt(new Position(5, 5)), {
        message: /out of bounds/,
      });
    });

    test("should throw for negative coordinates", () => {
      const grid = Grid.fromSize(3, 3, 0);
      assert.throws(() => grid.itemAt(new Position(-1, -1)));
    });
  });

  describe("itemAtOrNull", () => {
    test("should return GridPosition for valid position", () => {
      const grid = Grid.fromSize(3, 3, "x");
      const item = grid.itemAtOrNull(new Position(1, 1));
      assert.ok(item instanceof GridPosition);
      assert.strictEqual(item!.value, "x");
    });

    test("should return null for out of bounds", () => {
      const grid = Grid.fromSize(3, 3, 0);
      const item = grid.itemAtOrNull(new Position(5, 5));
      assert.strictEqual(item, null);
    });

    test("should return null for negative coordinates", () => {
      const grid = Grid.fromSize(3, 3, 0);
      const item = grid.itemAtOrNull(new Position(-1, -1));
      assert.strictEqual(item, null);
    });
  });

  describe("valueAt", () => {
    test("should return value at position", () => {
      const grid = new Grid([
        [1, 2],
        [3, 4],
      ]);
      assert.strictEqual(grid.valueAt(new Position(0, 0)), 1);
      assert.strictEqual(grid.valueAt(new Position(1, 0)), 2);
      assert.strictEqual(grid.valueAt(new Position(0, 1)), 3);
      assert.strictEqual(grid.valueAt(new Position(1, 1)), 4);
    });

    test("should throw for out of bounds", () => {
      const grid = Grid.fromSize(3, 3, 0);
      assert.throws(() => grid.valueAt(new Position(5, 5)));
    });

    test("should handle GridPosition input", () => {
      const grid = Grid.fromSize(3, 3, "x");
      const gridPos = grid.itemAt(new Position(1, 1));
      assert.strictEqual(grid.valueAt(gridPos), "x");
    });
  });

  describe("setValue", () => {
    test("should set value at position", () => {
      const grid = Grid.fromSize(3, 3, 0);
      grid.setValue(new Position(1, 1), 5);
      assert.strictEqual(grid.valueAt(new Position(1, 1)), 5);
    });

    test("should mutate the grid", () => {
      const grid = Grid.fromSize(2, 2, 0);
      grid.setValue(new Position(0, 0), 1);
      grid.setValue(new Position(1, 1), 2);
      assert.strictEqual(grid.items[0][0], 1);
      assert.strictEqual(grid.items[1][1], 2);
    });

    test("should throw for out of bounds", () => {
      const grid = Grid.fromSize(3, 3, 0);
      assert.throws(() => grid.setValue(new Position(5, 5), 10));
    });
  });
});

describe("GridPosition", () => {
  describe("value getter/setter", () => {
    test("should get value from grid", () => {
      const grid = Grid.fromSize(3, 3, "x");
      const pos = grid.itemAt(new Position(1, 1));
      assert.strictEqual(pos.value, "x");
    });

    test("should set value in grid", () => {
      const grid = Grid.fromSize(3, 3, 0);
      const pos = grid.itemAt(new Position(1, 1));
      pos.value = 5;
      assert.strictEqual(grid.valueAt(new Position(1, 1)), 5);
    });
  });

  describe("move", () => {
    test("should return GridPosition after move", () => {
      const grid = Grid.fromSize(5, 5, 0);
      const pos = grid.itemAt(new Position(2, 2));
      const newPos = pos.move(Direction.UP);
      assert.ok(newPos instanceof GridPosition);
      assert.strictEqual(newPos.x, 2);
      assert.strictEqual(newPos.y, 1);
    });

    test("should throw when moving out of bounds", () => {
      const grid = Grid.fromSize(3, 3, 0);
      const pos = grid.itemAt(new Position(0, 0));
      assert.throws(() => pos.move(Direction.UP));
    });

    test("should handle multiple steps", () => {
      const grid = Grid.fromSize(10, 10, 0);
      const pos = grid.itemAt(new Position(5, 5));
      const newPos = pos.move(Direction.RIGHT, 3);
      assert.strictEqual(newPos.x, 8);
      assert.strictEqual(newPos.y, 5);
    });
  });

  describe("moveOrNull", () => {
    test("should return GridPosition for valid move", () => {
      const grid = Grid.fromSize(5, 5, 0);
      const pos = grid.itemAt(new Position(2, 2));
      const newPos = pos.moveOrNull(Direction.UP);
      assert.ok(newPos instanceof GridPosition);
      assert.strictEqual(newPos!.x, 2);
      assert.strictEqual(newPos!.y, 1);
    });

    test("should return null when moving out of bounds", () => {
      const grid = Grid.fromSize(3, 3, 0);
      const pos = grid.itemAt(new Position(0, 0));
      const newPos = pos.moveOrNull(Direction.UP);
      assert.strictEqual(newPos, null);
    });

    test("should return null at all edges", () => {
      const grid = Grid.fromSize(3, 3, 0);

      // Top edge
      const top = grid.itemAt(new Position(1, 0));
      assert.strictEqual(top.moveOrNull(Direction.UP), null);

      // Bottom edge
      const bottom = grid.itemAt(new Position(1, 2));
      assert.strictEqual(bottom.moveOrNull(Direction.DOWN), null);

      // Left edge
      const left = grid.itemAt(new Position(0, 1));
      assert.strictEqual(left.moveOrNull(Direction.LEFT), null);

      // Right edge
      const right = grid.itemAt(new Position(2, 1));
      assert.strictEqual(right.moveOrNull(Direction.RIGHT), null);
    });
  });

  describe("toString", () => {
    test("should format with position and value", () => {
      const grid = Grid.fromSize(3, 3, "x");
      const pos = grid.itemAt(new Position(1, 2));
      assert.strictEqual(pos.toString(), "[x:1; y:2; value:x]");
    });

    test("should handle numeric values", () => {
      const grid = Grid.fromSize(3, 3, 42);
      const pos = grid.itemAt(new Position(0, 0));
      assert.strictEqual(pos.toString(), "[x:0; y:0; value:42]");
    });
  });

  describe("toPosition", () => {
    test("should convert to plain Position", () => {
      const grid = Grid.fromSize(3, 3, 0);
      const gridPos = grid.itemAt(new Position(1, 2));
      const pos = gridPos.toPosition();
      assert.ok(pos instanceof Position);
      assert.ok(!(pos instanceof GridPosition));
      assert.strictEqual(pos.x, 1);
      assert.strictEqual(pos.y, 2);
    });
  });

  describe("adjacents", () => {
    test("should return cardinal adjacents by default", () => {
      const grid = Grid.fromSize(5, 5, 0);
      const pos = grid.itemAt(new Position(2, 2));
      const adjacents = pos.adjacents();
      assert.strictEqual(adjacents.length, 4);

      // Check that we got all 4 cardinal directions
      const coords = adjacents.map((p) => `${p.x},${p.y}`).sort();
      assert.deepStrictEqual(coords, ["1,2", "2,1", "2,3", "3,2"]);
    });

    test("should exclude out-of-bounds positions", () => {
      const grid = Grid.fromSize(3, 3, 0);
      const corner = grid.itemAt(new Position(0, 0));
      const adjacents = corner.adjacents();
      assert.strictEqual(adjacents.length, 2); // Only right and down
    });

    test("should support all 8 directions", () => {
      const grid = Grid.fromSize(5, 5, 0);
      const pos = grid.itemAt(new Position(2, 2));
      const adjacents = pos.adjacents(Direction.ALL);
      assert.strictEqual(adjacents.length, 8);
    });

    test("should handle custom direction lists", () => {
      const grid = Grid.fromSize(5, 5, 0);
      const pos = grid.itemAt(new Position(2, 2));
      const adjacents = pos.adjacents([Direction.UP, Direction.DOWN]);
      assert.strictEqual(adjacents.length, 2);
    });
  });

  describe("direction helper methods", () => {
    test("leftOrNull should return left position or null", () => {
      const grid = Grid.fromSize(3, 3, 0);
      const pos = grid.itemAt(new Position(1, 1));
      const left = pos.leftOrNull();
      assert.ok(left);
      assert.strictEqual(left!.x, 0);
      assert.strictEqual(left!.y, 1);
    });

    test("rightOrNull should return right position or null", () => {
      const grid = Grid.fromSize(3, 3, 0);
      const pos = grid.itemAt(new Position(1, 1));
      const right = pos.rightOrNull();
      assert.ok(right);
      assert.strictEqual(right!.x, 2);
      assert.strictEqual(right!.y, 1);
    });

    test("upOrNull should return up position or null", () => {
      const grid = Grid.fromSize(3, 3, 0);
      const pos = grid.itemAt(new Position(1, 1));
      const up = pos.upOrNull();
      assert.ok(up);
      assert.strictEqual(up!.x, 1);
      assert.strictEqual(up!.y, 0);
    });

    test("downOrNull should return down position or null", () => {
      const grid = Grid.fromSize(3, 3, 0);
      const pos = grid.itemAt(new Position(1, 1));
      const down = pos.downOrNull();
      assert.ok(down);
      assert.strictEqual(down!.x, 1);
      assert.strictEqual(down!.y, 2);
    });

    test("diagonal helpers should work", () => {
      const grid = Grid.fromSize(5, 5, 0);
      const pos = grid.itemAt(new Position(2, 2));

      const upLeft = pos.upLeftOrNull();
      assert.ok(upLeft);
      assert.strictEqual(upLeft!.x, 1);
      assert.strictEqual(upLeft!.y, 1);

      const upRight = pos.upRightOrNull();
      assert.ok(upRight);
      assert.strictEqual(upRight!.x, 3);
      assert.strictEqual(upRight!.y, 1);

      const downLeft = pos.downLeftOrNull();
      assert.ok(downLeft);
      assert.strictEqual(downLeft!.x, 1);
      assert.strictEqual(downLeft!.y, 3);

      const downRight = pos.downRightOrNull();
      assert.ok(downRight);
      assert.strictEqual(downRight!.x, 3);
      assert.strictEqual(downRight!.y, 3);
    });

    test("should return null at boundaries", () => {
      const grid = Grid.fromSize(3, 3, 0);
      const corner = grid.itemAt(new Position(0, 0));

      assert.strictEqual(corner.leftOrNull(), null);
      assert.strictEqual(corner.upOrNull(), null);
      assert.strictEqual(corner.upLeftOrNull(), null);
    });
  });
});
