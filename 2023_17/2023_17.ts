import { Direction, Grid, GridPosition, Position } from "../utilities";

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

  let lowestKnownLoss = 0;
  const toVisit: Array<
    Array<{
      pos: GridPosition<string>;
      totalHeatLoss: number;
      straightSteps: number;
      lastDirection: null | Direction;
    }>
  > = [
    [
      {
        pos: start,
        straightSteps: 0,
        lastDirection: null,
        totalHeatLoss: 0,
      },
    ],
  ];
  const enqueueItem = (item: {
    pos: GridPosition<string>;
    totalHeatLoss: number;
    straightSteps: number;
    lastDirection: null | Direction;
  }) => {
    if (item.totalHeatLoss < lowestKnownLoss) {
      lowestKnownLoss = item.totalHeatLoss;
    }
    toVisit[item.totalHeatLoss] = toVisit[item.totalHeatLoss] || [];
    toVisit[item.totalHeatLoss].push(item);
  };
  const nextItem = () => {
    for (let i = lowestKnownLoss; i < 100_000; i++) {
      const arr = toVisit[i];
      if (arr !== undefined && arr.length > 0) {
        lowestKnownLoss = i;
        return arr.pop()!;
      }
    }
    throw new Error("No next item found");
  };
  while (toVisit.length > 0) {
    const from = nextItem();

    const nextDirections = Direction.CARDINAL.filter((d) => d !== from.lastDirection?.rotate180());
    for (const dir of nextDirections) {
      let next = from.pos.moveOrNull(dir);
      if (next === null) {
        continue;
      }

      const isTurning = from.lastDirection !== dir;

      let straightSteps = isTurning ? 1 : from.straightSteps + 1;
      if (straightSteps > maxStraight) {
        continue;
      }

      if (from.straightSteps < minStraight && isTurning && from.lastDirection !== null) {
        // we can't turn YET
        continue;
      }

      const newHeatLoss = from.totalHeatLoss + next.value.toInt();

      const lowestHeatKey = `${next.key}-${dir.key}-${straightSteps}`;
      if (lowestHeatForPosition.get(lowestHeatKey)! <= newHeatLoss) {
        continue;
      }
      lowestHeatForPosition.set(lowestHeatKey, newHeatLoss);

      if (next.equals(end)) {
        return newHeatLoss;
      }

      enqueueItem({
        pos: next,
        totalHeatLoss: newHeatLoss,
        straightSteps,
        lastDirection: dir,
      });
    }
  }
}
