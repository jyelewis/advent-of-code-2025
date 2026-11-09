import { memo, range } from "../utilities";

export function day2021_07(input: string, isPartB: boolean) {
  const crabs = input.split(",").map((pos) => pos.toInt());

  const start = Math.min(...crabs);
  const end = Math.max(...crabs);

  // optimisation: cache fuel cost to take n steps in partB
  const fuelForStepsB = memo((steps: number) => range(1, steps).sum());

  const fuelCosts = range(start, end) // for each possible destination target
    .map((target) =>
      // sum the fuel costs to get all crabs to said target
      crabs
        .map((pos) => {
          const steps = Math.abs(pos - target);
          if (isPartB) {
            return fuelForStepsB(steps);
          } else {
            return steps;
          }
        })
        .sum(),
    );

  return Math.min(...fuelCosts);
}
