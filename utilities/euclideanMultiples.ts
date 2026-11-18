import assert from "node:assert";

export function gcd(values: number[]) {
  assert(values.length > 0, "empty array provided");

  return values.reduce((a, b) => {
    assert(a >= 0 && b >= 0, "expected inputs to be >= 0");

    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }, 0);
}

export function lcm(values: number[]) {
  return values.reduce((a, b) => Math.abs((a / gcd([a, b])) * b), 1);
}
