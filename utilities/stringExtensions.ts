// its a crime I know, but for AOC some QOL enhancements go a long way
import assert from "node:assert";

declare global {
  interface String {
    lines(): string[];
    chars(): string[];
    toInt(): number;
  }
}

String.prototype.lines = function (): string[] {
  return this.split("\n");
};

String.prototype.chars = function (): string[] {
  return this.split("");
};

String.prototype.toInt = function (): number {
  const val = parseInt(this as string, 10);

  // check if any invalid characters are present
  if (!/^-?\d+$/.test(this as string)) {
    throw new Error(`String "${this}" is not made up of only base10 number characters`);
  }

  assert(!Number.isNaN(val), `String "${this}" parsed as NaN`);
  return val;
};

export {};
