import { Grid, Position, range } from "../utilities";

export function day2023_13a(input: string) {
  return input
    .split("\n\n")
    .map((patternStr) => Grid.fromString(patternStr))
    .map((pattern) => findReflections(pattern)[0])
    .sum();
}

export function day2023_13b(input: string) {
  return input
    .split("\n\n")
    .map((patternStr) => Grid.fromString(patternStr))
    .map((pattern) => {
      const originalReflections = findReflections(pattern);

      const newReflections = pattern.positions
        .mapNotNull((pos) => {
          // try flipping this pos & re-checking the reflections
          const ogVal = pos.value;
          pos.value = ogVal === "#" ? "." : "#";

          // find the alternate reflection (if any) after our change
          const newReflections = findReflections(pattern);
          const deltaReflections = newReflections.find((x) => originalReflections.indexOf(x) === -1);

          // reset our grid
          pos.value = ogVal;

          return deltaReflections || null;
        })
        .unique((x) => x.toString());

      return newReflections[0];
    })
    .sum();
}

function findVerticalReflections(pattern: Grid<string>): number[] {
  return range(pattern.width - 1).mapNotNull((reflectionAfterX) => {
    const elementsBefore = reflectionAfterX + 1;
    const elementsAfter = pattern.width - reflectionAfterX - 1;
    const elementsToMatch = Math.min(elementsBefore, elementsAfter);

    const isReflection = range(elementsToMatch).every((i) => {
      const x1 = reflectionAfterX - i;
      const x2 = reflectionAfterX + i + 1;
      // check every col is equal
      return range(pattern.height).every(
        (y) => pattern.valueAt(new Position(x1, y)) === pattern.valueAt(new Position(x2, y)),
      );
    });

    if (isReflection) {
      return reflectionAfterX + 1; // zero index to one index
    } else {
      return null;
    }
  });
}

function findHorizontalReflections(pattern: Grid<string>): number[] {
  return range(pattern.height - 1).mapNotNull((reflectionAfterY) => {
    const elementsBefore = reflectionAfterY + 1;
    const elementsAfter = pattern.height - reflectionAfterY - 1;
    const elementsToMatch = Math.min(elementsBefore, elementsAfter);

    const isReflection = range(elementsToMatch).every((i) => {
      const y1 = reflectionAfterY - i;
      const y2 = reflectionAfterY + i + 1;
      // check every row is equal
      return range(pattern.width).every(
        (x) => pattern.valueAt(new Position(x, y1)) === pattern.valueAt(new Position(x, y2)),
      );
    });

    if (isReflection) {
      return (reflectionAfterY + 1) * 100; // zero index to one index
    } else {
      return null;
    }
  });
}

function findReflections(pattern: Grid<string>): number[] {
  return findVerticalReflections(pattern).concat(findHorizontalReflections(pattern));
}
