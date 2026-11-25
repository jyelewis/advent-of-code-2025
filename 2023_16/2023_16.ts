import { Direction, Grid, GridPosition, Position, range } from "../utilities";

export function day2023_16a(input: string) {
  const grid = Grid.fromString(input);
  return testEntryPoint(grid, new Position(0, 0), Direction.RIGHT);
}

export function day2023_16b(input: string) {
  const grid = Grid.fromString(input);
  let bestResult = 0;

  // top & bottom
  for (const x of range(grid.width)) {
    bestResult = Math.max(
      bestResult,
      testEntryPoint(grid, new Position(x, 0), Direction.DOWN),
      testEntryPoint(grid, new Position(x, grid.height - 1), Direction.UP),
    );
  }

  // left & right
  for (const y of range(grid.height)) {
    bestResult = Math.max(
      bestResult,
      testEntryPoint(grid, new Position(0, y), Direction.RIGHT),
      testEntryPoint(grid, new Position(grid.width - 1, y), Direction.LEFT),
    );
  }
  return bestResult;
}

function testEntryPoint(grid: Grid<string>, initialPosition: Position, initialDirection: Direction) {
  let dupCheck = new Set<string>();
  let energizedCells = new Set<string>();

  const stepBeam = (pos: GridPosition<string> | null, direction: Direction) => {
    if (pos === null) {
      return;
    }

    // when we see a beam on a cell, we mark it as energised
    const key = `${pos.key}-${direction.key}`;
    if (dupCheck.has(key)) {
      return;
    }
    dupCheck.add(key);
    energizedCells.add(pos.key);

    switch (pos.value) {
      case ".": {
        stepBeam(pos.moveOrNull(direction), direction);
        break;
      }
      case "/": {
        const newDirection = Direction.fromChar(
          {
            ">": "^",
            "<": "v",
            "^": ">",
            v: "<",
            "?": "?",
          }[direction.toChar()],
        );

        stepBeam(pos.moveOrNull(newDirection), newDirection);
        break;
      }
      case "\\": {
        const newDirection = Direction.fromChar(
          {
            ">": "v",
            "<": "^",
            "^": "<",
            v: ">",
            "?": "?",
          }[direction.toChar()],
        );

        stepBeam(pos.moveOrNull(newDirection), newDirection);
        break;
      }
      case "|": {
        if (direction === Direction.LEFT || direction === Direction.RIGHT) {
          stepBeam(pos.upOrNull(), Direction.UP);
          stepBeam(pos.downOrNull(), Direction.DOWN);
        } else {
          // hitting pointy end, behaves as '.'
          stepBeam(pos.moveOrNull(direction), direction);
        }
        break;
      }
      case "-": {
        if (direction === Direction.UP || direction === Direction.DOWN) {
          stepBeam(pos.leftOrNull(), Direction.LEFT);
          stepBeam(pos.rightOrNull(), Direction.RIGHT);
        } else {
          // hitting pointy end, behaves as '.'
          stepBeam(pos.moveOrNull(direction), direction);
        }
        break;
      }
    }
  };

  stepBeam(grid.itemAt(initialPosition), initialDirection);

  return energizedCells.size;
}
