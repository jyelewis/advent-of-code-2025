import { Direction, Position, range, sscanf } from "../utilities";
import assert from "node:assert";

export function day2023_18a(input: string) {
  const instructions = input.lines().map((line) => {
    const [dirStr, steps] = sscanf`${String} ${Number} (#${String})`(line);
    const direction: Direction = (
      {
        R: Direction.RIGHT,
        L: Direction.LEFT,
        U: Direction.UP,
        D: Direction.DOWN,
      } as any
    )[dirStr];
    assert(direction !== undefined);

    return { direction, steps };
  });

  return solve(instructions);
}

export function day2023_18b(input: string) {
  const instructions = input.lines().map((line) => {
    const [_1, _2, colour] = sscanf`${String} ${Number} (#${String})`(line);
    const steps = parseInt(colour.substring(0, 5), 16);
    const dirCode = colour.charAt(5);

    const direction: Direction = (
      {
        0: Direction.RIGHT,
        2: Direction.LEFT,
        3: Direction.UP,
        1: Direction.DOWN,
      } as any
    )[dirCode];
    assert(direction !== undefined);

    return { direction, steps };
  });

  return solve(instructions);
}

function solve(instructions: Array<{ direction: Direction; steps: number }>) {
  let perimeter = 0;
  let pos = new Position(0, 0);
  let vertexes: Position[] = [pos];

  instructions.forEach(({ direction, steps }) => {
    pos = pos.move(direction, steps);
    vertexes.push(pos);
    perimeter += steps;
  });

  return shoelaceFormula(vertexes) + perimeter / 2 + 1;
}

function shoelaceFormula(vertexes: Position[]): number {
  let sum1b = 0n;
  let sum2b = 0n;
  for (const i of range(0, vertexes.length - 2)) {
    sum1b += BigInt(vertexes[i].x) * BigInt(vertexes[i + 1].y);
    sum2b += BigInt(vertexes[i].y) * BigInt(vertexes[i + 1].x);
  }
  sum1b += BigInt(vertexes[vertexes.length - 1].x) * BigInt(vertexes[0].y);
  sum2b += BigInt(vertexes[vertexes.length - 1].y) * BigInt(vertexes[0].x);

  return Math.abs(Number(sum1b - sum2b)) / 2;
}
