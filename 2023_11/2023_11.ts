import { Direction, Grid, Position, range } from "../utilities";

function expandAndCalculateDistance(input: string, galaxyExpansion: number) {
  const grid = Grid.fromString(input);

  // count our empty rows & cols
  const verticalEmpties = range(0, grid.width - 1).filter((x) =>
    range(0, grid.height - 1).every((y) => grid.itemAt(new Position(x, y)).value === "."),
  );
  const horizontalEmpties = range(0, grid.height - 1).filter((y) =>
    range(0, grid.width - 1).every((x) => grid.itemAt(new Position(x, y)).value === "."),
  );

  // move our galaxies based on expansion
  const expandedGalaxies = grid.positions
    .filter((pos) => pos.value === "#")
    .map((galaxy) =>
      // shift x & y based on the expanded horizontal & vertical empties
      galaxy
        .toPosition()
        .move(Direction.RIGHT, verticalEmpties.count((x) => x < galaxy.x) * (galaxyExpansion - 1))
        .move(Direction.DOWN, horizontalEmpties.count((y) => y < galaxy.y) * (galaxyExpansion - 1)),
    );

  // sum up the distance between our galaxies
  return expandedGalaxies
    .flatMap((g1) => {
      return expandedGalaxies
        .filter((g2) => g2 !== g1)
        .map((g2) => {
          const key = [g1.key, g2.key].toSorted().join(";");
          const distance = g1.manhattanDistanceTo(g2);
          return { key, distance };
        });
    })
    .unique((pair) => pair.key)
    .map((pair) => pair.distance)
    .sum();
}

export function day2023_11(input: string) {
  return {
    partA: expandAndCalculateDistance(input, 2),
    partB: expandAndCalculateDistance(input, 1000000),
  };
}
