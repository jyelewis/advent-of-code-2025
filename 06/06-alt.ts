export function day06BAlt(input: string) {
  // inspired by Freds, much simpler solution
  // https://github.com/fredgreer/advent-of-code-2025/blob/main/day6/day6b.ts
  // with added wank of using utilities 😛

  let sum = 0;
  let accumulator: number[] = [];
  input
    .lines()
    .map((line) => line.chars())
    .transpose()
    .toReversed()
    .map((x) => x.join(""))
    .filter((x) => x.trim().length > 0)
    .forEach((colStr) => {
      const operator = colStr.at(-1);
      const numberStr = colStr.slice(0, -1);

      accumulator.push(parseInt(numberStr, 10));

      if (operator === "*") {
        sum += accumulator.product();
        accumulator = [];
      }

      if (operator === "+") {
        sum += accumulator.sum();
        accumulator = [];
      }
    });

  return sum;
}
