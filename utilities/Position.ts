import { Direction } from "./Direction";

export class Position {
  constructor(
    public x: number,
    public y: number,
  ) {}

  public move(direction: Direction, steps: number = 1) {
    return new Position(
      this.x + direction.dx * steps,
      this.y + direction.dy * steps,
    ) as this;
  }

  get key() {
    return `${this.x},${this.y}`;
  }

  equals(other: Position) {
    return this.x === other.x && this.y === other.y;
  }

  toString() {
    return `[x:${this.x}; y:${this.y}]`;
  }

  isAdjacentTo(otherPos: Position) {
    return Math.abs(this.x - otherPos.x) + Math.abs(this.y - otherPos.y) === 1;
  }

  manhattanDistanceTo(other: Position) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
  }

  // direction step utils
  left() {
    return this.move(Direction.LEFT);
  }
  right() {
    return this.move(Direction.RIGHT);
  }
  up() {
    return this.move(Direction.UP);
  }
  down() {
    return this.move(Direction.DOWN);
  }
  upLeft() {
    return this.move(Direction.UP_LEFT);
  }
  upRight() {
    return this.move(Direction.UP_RIGHT);
  }
  downLeft() {
    return this.move(Direction.DOWN_LEFT);
  }
  downRight() {
    return this.move(Direction.DOWN_RIGHT);
  }
}
