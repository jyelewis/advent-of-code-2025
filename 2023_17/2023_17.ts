import { Direction, Grid, GridPosition, Position } from "../utilities";
import assert from "node:assert";

// TODO: ok it does the thing but hella slow, speed me up

export function day2023_17a(input: string) {
  return findLowestHeatLoss(input, 0, 3);
}

export function day2023_17b(input: string) {
  return findLowestHeatLoss(input, 4, 10);
}

function findLowestHeatLoss(input: string, minStraight: number, maxStraight: number) {
  const grid = Grid.fromString(input);

  const start = grid.itemAt(new Position(0, 0));
  const end = grid.itemAt(new Position(grid.width - 1, grid.height - 1));

  const lowestHeatForPosition = new Map<string, number>();

  const toVisit: Array<{
    pos: GridPosition<string>;
    totalHeatLoss: number;
    straightSteps: number;
    lastDirection: null | Direction;
  }> = [
    {
      pos: start,
      straightSteps: 0,
      lastDirection: null,
      totalHeatLoss: 0,
    },
  ];
  while (toVisit.length > 0) {
    toVisit.sort((a, b) => a.totalHeatLoss - b.totalHeatLoss);
    const from = toVisit.shift();
    assert(from !== undefined);

    const nextDirections = Direction.CARDINAL.filter((d) => d !== from.lastDirection?.rotate180());
    for (const dir of nextDirections) {
      const next = from.pos.moveOrNull(dir);
      if (next === null) {
        continue;
      }

      const isTurning = from.lastDirection !== dir;

      const straightSteps = isTurning ? 1 : from.straightSteps + 1;
      if (straightSteps > maxStraight) {
        continue;
      }

      if (from.straightSteps < minStraight && isTurning && from.lastDirection !== null) {
        // we can't turn YET
        continue;
      }

      const lowestHeatKey = `${next.key}-${dir.key}-${straightSteps}`;
      if (lowestHeatForPosition.get(lowestHeatKey)! <= from.totalHeatLoss) {
        continue;
      }
      lowestHeatForPosition.set(lowestHeatKey, from.totalHeatLoss);

      if (next.equals(end)) {
        return from.totalHeatLoss + next.value.toInt();
      }

      toVisit.push({
        pos: next,
        totalHeatLoss: from.totalHeatLoss + next.value.toInt(),
        straightSteps,
        lastDirection: dir,
      });
    }
  }

  assert(false);
}
