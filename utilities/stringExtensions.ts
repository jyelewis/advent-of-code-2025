// its a crime I know, but for AOC some QOL enhancements go a long way
declare global {
  interface String {
    lines(): string[];
    chars(): string[];
  }
}

String.prototype.lines = function (): string[] {
  return this.split("\n");
};

String.prototype.chars = function (): string[] {
  return this.split("");
};

export {};
