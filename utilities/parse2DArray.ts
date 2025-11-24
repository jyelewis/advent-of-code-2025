export function parse2DArray(input: string): number[][] {
  return input.lines().map((line) =>
    // split on non digit characters, and convert to numbers
    line
      .split(/[^-0-9]+/g)
      .map((numStr) => parseInt(numStr.trim(), 10))
      .filter((x) => !Number.isNaN(x)),
  );
}
