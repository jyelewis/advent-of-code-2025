import { Direction, Grid, GridPosition, memo } from "../utilities";

export const NUM_PAD = Grid.fromString(
  `
789
456
123
 0A`.trim(),
);
export const ARROW_PAD = Grid.fromString(" ^A\n<v>");

const pathfind = (from: GridPosition<string>, to: GridPosition<string>): Direction[] => {
  // each from->to has at most 2 useful paths, horz-first and vert-first
  // anything that alternates will be wasteful on the higher level pads, so ignore those options
  // need to ensure we never hit the empty space
  const vertDirection = from.y < to.y ? Direction.DOWN : Direction.UP;
  const vertSteps = Math.abs(to.y - from.y);

  const horzDirection = from.x < to.x ? Direction.RIGHT : Direction.LEFT;
  const horzSteps = Math.abs(to.x - from.x);

  if (horzSteps === 0 && vertSteps === 0) {
    return []; // we're already there!
  }

  const horzPath: Direction[] = new Array(horzSteps).fill(horzDirection);
  const vertPath: Direction[] = new Array(vertSteps).fill(vertDirection);

  const paths: Direction[][] = [];
  // path is only valid if we don't turn on an empty space
  if (from.move(vertDirection, vertSteps).value !== " " && vertSteps > 0) {
    paths.push([...vertPath, ...horzPath]);
  }
  if (from.move(horzDirection, horzSteps).value !== " " && horzSteps > 0) {
    paths.push([...horzPath, ...vertPath]);
  }

  // we can preempt which path will be faster to enter from a higher order key-pad in advance, only propose the fast paths
  const buttonOrderPreference = [Direction.LEFT, Direction.UP, Direction.DOWN, Direction.RIGHT];
  return paths.toSorted((a, b) => buttonOrderPreference.indexOf(a[0]) - buttonOrderPreference.indexOf(b[0]))[0];
};

const pressesRequired = memo((buttons: string[], numRobots: number): number => {
  // also always starts on "A"
  let currentPosition = ARROW_PAD.positions.findOne((p) => p.value === "A");

  return buttons
    .map((button) => {
      const dest = ARROW_PAD.positions.findOne((p) => p.value === button);
      const indirectButtons: string[] = pathfind(currentPosition, dest).map((b) => b.toChar());
      currentPosition = dest;
      indirectButtons.push("A");

      if (numRobots === 1) {
        return indirectButtons.length;
      }

      return pressesRequired(indirectButtons, numRobots - 1);
    })
    .sum();
});

const keypadPressesRequired = (code: string, numRobots: number) => {
  // always starts on "A"
  let srcPosition = NUM_PAD.positions.findOne((p) => p.value === "A");

  return code
    .chars()
    .map((char) => {
      const destPosition = NUM_PAD.positions.findOne((x) => x.value === char);

      const arrowPressButtons: string[] = pathfind(srcPosition, destPosition).map((x) => x.toChar());
      arrowPressButtons.push("A");

      srcPosition = destPosition;

      return pressesRequired(arrowPressButtons, numRobots);
    })
    .sum();
};

export function day2024_21a(input: string) {
  return input
    .lines()
    .map((code) => parseInt(code, 10) * keypadPressesRequired(code, 2))
    .sum();
}

export function day2024_21b(input: string) {
  return input
    .lines()
    .map((code) => parseInt(code, 10) * keypadPressesRequired(code, 25))
    .sum();
}
