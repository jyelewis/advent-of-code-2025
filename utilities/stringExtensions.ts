// its a crime I know, but for AOC some QOL enhancements go a long way
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
  if (Number.isNaN(val)) {
    throw new Error(`String "${this}" is not a valid base10 number`);
  }
  return val;
};

export {};
