import { Direction, Grid } from "../utilities";

export function day04a(input: string) {
  return (
    Grid.fromString(input)
      .positions.filter((pos) => pos.value === "@") // filter to only positions with paper (@)
      // count any positions that have less than 4 adjacent paper (@) positions
      .count((pos) => pos.adjacents(Direction.ALL).filter((x) => x.value === "@").length < 4)
  );
}

export function day04b(input: string) {
  const grid = Grid.fromString(input);
  let totalRemoved = 0;

  while (true) {
    // find any "@" positions that have less than 4 adjacent "@" positions - we can remove those
    const removablePositions = grid.positions
      .filter((pos) => pos.value === "@")
      .filter((pos) => pos.adjacents(Direction.ALL).filter((x) => x.value === "@").length < 4);

    // mark them as removed
    removablePositions.forEach((pos) => (pos.value = "#"));

    // keep track of how many we removed
    totalRemoved += removablePositions.length;

    // if we can't remove any more, we're done
    if (removablePositions.length === 0) {
      break;
    }
  }

  return totalRemoved;
}
