import { Grid, GridPosition, memo } from "../utilities";

export function day07(input: string) {
  const grid = Grid.fromString(input);
  const startPosition = grid.positions.findOne((pos) => pos.value === "S");
  const splitLocations = new Set<string>();

  // recursively count the number of unique timelines from a given position
  const numTimelinesFromPosition = memo((beam: GridPosition<string>): number => {
    if (beam.downOrNull()?.value === "^") {
      // part A: record unique split locations
      splitLocations.add(beam.down().key);

      // part B: split path, count timelines from both sides
      return numTimelinesFromPosition(beam.down().right()) + numTimelinesFromPosition(beam.down().left());
    }

    if (beam.downOrNull()?.value === ".") {
      // count timelines from moving down one
      return numTimelinesFromPosition(beam.down());
    }

    // we've reached the end of a unique timeline
    return 1;
  });

  const partB = numTimelinesFromPosition(startPosition);
  const partA = splitLocations.size;

  return { partA, partB };
}
