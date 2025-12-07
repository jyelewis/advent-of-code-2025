import { Grid, GridPosition, memo } from "../utilities";

export function day07a(input: string) {
  const grid = Grid.fromString(input);
  const startPosition = grid.positions.findOne((pos) => pos.value === "S");

  let splitLocations = new Set<string>();
  let prevTachyonBeams = [startPosition];
  while (prevTachyonBeams.length > 0) {
    const newTachyonBeams = [];
    for (const beam of prevTachyonBeams) {
      if (beam.downOrNull()?.value === "^") {
        // split
        if (!splitLocations.has(beam.down().key)) {
          splitLocations.add(beam.down().key);
          newTachyonBeams.push(beam.down().right());
          newTachyonBeams.push(beam.down().left());
        }
      }

      if (beam.downOrNull()?.value === ".") {
        // move down
        newTachyonBeams.push(beam.down());
      }
    }

    prevTachyonBeams = newTachyonBeams;
  }

  return splitLocations.size;
}

export function day07b(input: string) {
  const grid = Grid.fromString(input);
  const startPosition = grid.positions.findOne((pos) => pos.value === "S");

  const numTimelinesFromPosition = memo((beam: GridPosition<string>): number => {
    if (beam.downOrNull()?.value === "^") {
      // split path, count timelines from both sides
      return numTimelinesFromPosition(beam.down().right()) + numTimelinesFromPosition(beam.down().left());
    }

    if (beam.downOrNull()?.value === ".") {
      // count timelines from moving down one
      return numTimelinesFromPosition(beam.down());
    }

    // we've reached the end of a unique timeline
    return 1;
  });

  return numTimelinesFromPosition(startPosition);
}
