// its a crime I know, but for AOC some QOL enhancements go a long way
declare global {
  interface String {
    lines(): string[];
    chars(): string[];
    numbers(): number[];
  }
}

String.prototype.lines = function (): string[] {
  return this.split("\n");
};

String.prototype.chars = function (): string[] {
  return this.split("");
};

String.prototype.numbers = function (): number[] {
  return this.chars().map((char) => {
    const val = parseInt(char, 10);
    if (isNaN(val)) {
      throw new Error(`Character "${char}" is not a valid number`);
    }
    return val;
  });
};

export {};
