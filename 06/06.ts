import { range } from "../utilities";

export function day06a(input: string) {
  const input2 = input.lines().map((line) => {
    return line
      .split(/ /g)
      .map((x) => x.trim())
      .filter((x) => x.length !== 0);
  });

  const input3 = range(input2[0].length).map((colIndex) => {
    return range(input2.length).map((rowIndex) => {
      return input2[rowIndex][colIndex];
    });
  });

  const sums = input3.map((eq) => {
    const numStrs = eq.slice(0, -1);
    const operation = eq[eq.length - 1];
    const nums = numStrs.map((x) => x.toInt());
    if (operation === "+") {
      return nums.sum();
    } else if (operation === "*") {
      return nums.product();
    } else {
      throw new Error(`Unknown operation: ${operation}`);
    }
  });

  return sums.sum();
}

export function day06b(input: string) {
  return 123;
}
