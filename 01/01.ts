import { range } from "../utilities";

export function day01(input: string) {
  let dialValue = 50;
  let numZeroLandings = 0;
  let numZeroCrossings = 0;

  for (const rotation of input.lines()) {
    const direction = rotation.charAt(0);
    const value = parseInt(rotation.slice(1));

    for (const i of range(value)) {
      dialValue = direction === "L" ? dialValue + 1 : dialValue - 1;
      if (dialValue === 100) dialValue = 0;
      if (dialValue === -1) dialValue = 99;
      if (dialValue === 0) numZeroCrossings++;
    }

    if (dialValue === 0) numZeroLandings += 1;
  }

  return {
    partA: numZeroLandings,
    partB: numZeroCrossings,
  };
}
