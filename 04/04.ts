import { Direction, Grid } from "../utilities";

export function day04a(input: string) {
  const grid = Grid.fromString(input);

  return grid.positions
    .filter((pos) => pos.value === "@")
    .count((pos) => {
      const hasFewerThan4 = pos.adjacents(Direction.ALL).filter((x) => x.value === "@").length < 4;
      return hasFewerThan4;
    });
}

export function day04b(input: string) {
  const grid = Grid.fromString(input);

  let totalRemoved = 0;

  while (true) {
    const removablePositions = grid.positions
      .filter((pos) => pos.value === "@")
      .filter((pos) => {
        const hasFewerThan4 = pos.adjacents(Direction.ALL).filter((x) => x.value === "@").length < 4;
        return hasFewerThan4;
      });
    totalRemoved += removablePositions.length;

    if (removablePositions.length === 0) {
      break;
    }

    removablePositions.forEach((pos) => {
      grid.setValue(pos, "x");
    });
  }

  return totalRemoved;
}
