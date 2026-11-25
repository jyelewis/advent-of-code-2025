import { Direction, Grid, GridPosition, Position, range } from "../utilities";
import assert from "node:assert";

function tiltPlatform(grid: Grid<string>, direction: Direction) {
  const backwards = direction === Direction.DOWN || direction === Direction.RIGHT;
  const flipXY = direction === Direction.LEFT || direction === Direction.RIGHT;

  for (const a of range(flipXY ? grid.height : grid.width)) {
    const start = 0;
    const end = flipXY ? grid.width - 1 : grid.height - 1;
    for (const b of range(backwards ? end : start, backwards ? start : end, backwards ? -1 : 1)) {
      const x = flipXY ? b : a;
      const y = flipXY ? a : b;
      const pos = new Position(x, y);

      const originalSlot = grid.itemAt(pos);
      if (originalSlot.value !== "O") {
        continue;
      }

      // find slot this should move into
      let newSlot = originalSlot;
      let nextNewSlot: GridPosition<string> | null = newSlot;
      do {
        newSlot = nextNewSlot!;
        nextNewSlot = newSlot.moveOrNull(direction);
      } while (nextNewSlot !== null && nextNewSlot.value === ".");

      originalSlot.value = ".";
      newSlot.value = "O";
    }
  }
}

export function day2023_14a(input: string) {
  const platform = Grid.fromString(input);

  tiltPlatform(platform, Direction.UP);

  return platform.positions
    .filter((pos) => pos.value === "O")
    .map((pos) => platform.height - pos.y)
    .sum();
}

export function day2023_14b(input: string) {
  const platform = Grid.fromString(input);
  const cycles = 1000000000;

  // run the simulation for a short number of cycles to log the pattern we fall into
  const log: number[] = [];
  for (let i = 1; i <= 120; i++) {
    for (const dir of [Direction.NORTH, Direction.WEST, Direction.SOUTH, Direction.EAST]) {
      tiltPlatform(platform, dir);
    }

    const val = platform.positions
      .filter((pos) => pos.value === "O")
      .map((pos) => platform.height - pos.y)
      .sum();

    log.push(val);
  }

  // ah-ha, this pattern goes in cycles
  // for the demo data: cycle of 7, starting after 2
  // so theoretically,
  // start_offset = 2
  // loop = [69, 69, 65, 64, 65, 63, 68]
  // (1000000000 - start_offset - 1) % loop.length = 4

  // Locate this pattern within any stream

  let startOffset = null;
  const distancesToNext: number[] = [];
  for (const [i, val] of log.entries()) {
    const indexOfNext = log.indexOf(val, i + 1);
    const distanceToNext = indexOfNext === -1 ? null : indexOfNext - i;

    // if this value repeats, and is the first value to repeat, it's our start offset
    if (startOffset === null && distanceToNext !== null && distanceToNext > 5) {
      startOffset = i;
    }

    if (distanceToNext !== null) {
      distancesToNext.push(distanceToNext);
    }
  }
  assert(startOffset !== null, "Could not detect start offset");

  const loopSize = Math.max(...distancesToNext);
  const loop = log.slice(startOffset, startOffset + loopSize);

  return loop[(cycles - startOffset - 1) % loop.length];
}
