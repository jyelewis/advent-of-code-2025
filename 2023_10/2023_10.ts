import { Direction, Grid, GridPosition } from "../utilities";
import assert from "node:assert";

// TODO: tidy me :)
// really struggled with this one

export function day2023_10a(input: string) {
  const grid = Grid.fromString(input);
  const startingPosition = grid.positions.findOne((p) => p.value === "S");

  // example & my input both support going 'down' to start
  let lastDirection = Direction.DOWN;
  let position = startingPosition.move(Direction.DOWN);
  let stepsTaken = 1;

  while (position.value !== "S") {
    // TODO: simplify?
    const nextDirection = nextPipeDirection(lastDirection, position.value);
    position = position.move(nextDirection);
    lastDirection = nextDirection;

    stepsTaken++;
  }

  return stepsTaken / 2;
}

function nextPipeDirection(incomingDirection: Direction, shape: string) {
  const pipes: Record<string, Direction[]> = {
    "|": [Direction.NORTH, Direction.SOUTH],
    "-": [Direction.EAST, Direction.WEST],
    L: [Direction.NORTH, Direction.EAST],
    J: [Direction.NORTH, Direction.WEST],
    7: [Direction.SOUTH, Direction.WEST],
    F: [Direction.SOUTH, Direction.EAST],
  };

  assert(shape in pipes);
  const incomingDirRev = incomingDirection.rotate90CW().rotate90CW();
  return pipes[shape].findOne((x) => !x.equals(incomingDirRev));
}

export function day2023_10b(input: string) {
  // to calculate whether something is inside or not
  // record all the barrier entries
  // count how many times we pass a barrier when going towards the left, and the top
  // must both be odd to be inside the area

  const grid = Grid.fromString(input);
  const startingPosition = grid.positions.findOne((p) => p.value === "S");

  // example & my input both support going 'down' to start
  let lastDirection = Direction.DOWN;
  let position = startingPosition.move(Direction.DOWN);
  // let stepsTaken = 1;

  const pathPositions = new Set<string>();

  let startOfCurrentPath = startingPosition;
  const verticalLines = []; // top to bottom
  const horizontalLines = []; // left to right

  while (position.value !== "S") {
    pathPositions.add(position.key);

    // TODO: simplify?
    const nextDirection = nextPipeDirection(lastDirection, position.value);

    if (!nextDirection.equals(lastDirection)) {
      // console.log(3333, nextDirection.toString(), lastDirection.toString());
      // we're turning! Record our current line

      switch (lastDirection) {
        case Direction.UP:
          // top down
          verticalLines.push({
            start: position.down(), // don't include the top most cell, we turn at the bottom of cells
            end: startOfCurrentPath,
          });
          break;
        case Direction.DOWN:
          // top down
          verticalLines.push({
            start: startOfCurrentPath.down(),
            end: position, // don't include the top most cell, we turn at the bottom of cells
          });
          break;
        case Direction.LEFT:
          // left to right
          horizontalLines.push({
            start: position,
            end: startOfCurrentPath.left(),
          });
          break;
        case Direction.RIGHT:
          // left to right
          horizontalLines.push({
            start: startOfCurrentPath,
            end: position.left(),
          });
          break;
        default:
          throw new Error(`Unknown direction ${lastDirection}???`);
      }

      startOfCurrentPath = position;
    }

    position = position.move(nextDirection);

    lastDirection = nextDirection;

    // stepsTaken++;
  }

  // console.log({ verticalLines, horizontalLines });

  const verticalLineCells = new Map<string, number>();
  let verticalLineNum = 1;
  for (const verticalLine of verticalLines) {
    let pos = verticalLine.start;
    // TODO: this doesn't support 1 long segments?
    //       unless this hack fixes that
    verticalLineCells.set(pos.key, verticalLineNum);

    while (!pos.equals(verticalLine.end)) {
      verticalLineCells.set(pos.key, verticalLineNum);
      pos = pos.down();
    }
    verticalLineNum++;
  }

  const horizontalLineCells = new Map<string, number>();
  let horizontalLineNum = 1;
  for (const horizontalLine of horizontalLines) {
    let pos = horizontalLine.start;
    horizontalLineCells.set(pos.key, horizontalLineNum);

    while (!pos.equals(horizontalLine.end)) {
      horizontalLineCells.set(pos.key, horizontalLineNum);
      pos = pos.right();
    }
    horizontalLineNum++;
  }

  // now iterate every point, and count which are inside
  const asdf = grid.positions.count((pos) => {
    if (pathPositions.has(pos.key)) {
      // not inside if we're on the edge
      // pos.value = "X";
      return false;
    }

    let pathsToTheLeft = 0;
    let lastVerticalLineCellNum = 0;
    let lastHorizontalLineCellNum = 0;
    let cursor: null | GridPosition<string> = pos.leftOrNull();
    while (cursor !== null) {
      // TODO: gotta check the line num has changed!
      if (verticalLineCells.has(cursor.key) && verticalLineCells.get(cursor.key)! !== lastVerticalLineCellNum) {
        // we just stepped onto a boundary, inc count
        lastVerticalLineCellNum = verticalLineCells.get(cursor.key)!;
        pathsToTheLeft++;
      }

      // shuffle across
      cursor = cursor.leftOrNull();
    }

    let pathsAbove = 0;
    cursor = pos.upOrNull();
    while (cursor !== null) {
      if (horizontalLineCells.has(cursor.key) && horizontalLineCells.get(cursor.key)! !== lastHorizontalLineCellNum) {
        // we just stepped onto a boundary, inc count
        lastHorizontalLineCellNum = horizontalLineCells.get(cursor.key)!;
        pathsAbove++;
      }

      // shuffle across
      cursor = cursor.upOrNull();
    }

    // TODO: ah-ha, we need to only count vertical / horizontal runs! We're ticking across for each
    // console.log({ pathsToTheLeft, pathsAbove });
    const leftPathsOdd = pathsToTheLeft % 2 === 1;
    const abovePathsOdd = pathsAbove % 2 === 1;

    const isInside = leftPathsOdd && abovePathsOdd;

    return isInside;
  });

  // grid.print();

  return asdf;
}
