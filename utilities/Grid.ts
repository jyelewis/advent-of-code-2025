import { Position } from "./Position";
import assert from "node:assert";
import { range } from "./range";
import { Direction } from "./Direction";

export class GridPosition<PosValue> extends Position {
  constructor(
    public readonly grid: Grid<PosValue>,
    x: number,
    y: number,
  ) {
    super(x, y);
  }

  get value(): PosValue {
    return this.grid.valueAt(this);
  }

  set value(value: PosValue) {
    this.grid.setValue(this, value);
  }

  public move(direction: Direction, steps: number = 1) {
    // look up the equivalent position on the grid to ensure we get the correct value
    const newPosition = super.move(direction, steps);
    return this.grid.itemAt(newPosition) as this;
  }

  public moveOrNull(direction: Direction, steps: number = 1) {
    // look up the equivalent position on the grid to ensure we get the correct value
    const newPosition = super.move(direction, steps);
    if (!this.grid.isInBounds(newPosition)) {
      return null;
    }
    return this.grid.itemAt(newPosition) as this;
  }

  toString() {
    return `[x:${this.x}; y:${this.y}; value:${this.value}]`;
  }

  // required for manual downcasting, to remove bounds checks from GridPosition objects
  toPosition() {
    return new Position(this.x, this.y);
  }

  adjacents(
    directions: Direction[] = Direction.CARDINAL,
  ): GridPosition<PosValue>[] {
    return directions.mapNotNull((dir) => this.moveOrNull(dir));
  }

  // direction step utils
  leftOrNull() {
    return this.moveOrNull(Direction.LEFT);
  }
  rightOrNull() {
    return this.moveOrNull(Direction.RIGHT);
  }
  upOrNull() {
    return this.moveOrNull(Direction.UP);
  }
  downOrNull() {
    return this.moveOrNull(Direction.DOWN);
  }
  upLeftOrNull() {
    return this.moveOrNull(Direction.UP_LEFT);
  }
  upRightOrNull() {
    return this.moveOrNull(Direction.UP_RIGHT);
  }
  downLeftOrNull() {
    return this.moveOrNull(Direction.DOWN_LEFT);
  }
  downRightOrNull() {
    return this.moveOrNull(Direction.DOWN_RIGHT);
  }
}

export class Grid<PosValue> {
  public readonly width: number;
  public readonly height: number;
  constructor(public readonly items: PosValue[][]) {
    assert(items.length > 0, "items must be non empty");

    this.width = items[0].length;
    this.height = items.length;

    // validate every sub-array is the same size
    assert(
      items.every((row) => row.length === this.width),
      "Inconsistent row sizes",
    );
  }

  static fromSize<PosValue>(
    width: number,
    height: number,
    defaultValue: PosValue,
  ) {
    const items: PosValue[][] = [];
    for (let y = 0; y < height; y++) {
      const row: PosValue[] = [];
      for (let x = 0; x < width; x++) {
        row.push(defaultValue);
      }
      items.push(row);
    }

    return new Grid(items);
  }

  static fromString(input: string) {
    return new Grid(input.lines().map((line) => line.chars()));
  }

  get positions(): GridPosition<PosValue>[] {
    const arr: Array<GridPosition<PosValue>> = [];
    for (const y of range(this.height)) {
      for (const x of range(this.width)) {
        arr.push(new GridPosition(this, x, y));
      }
    }

    return arr;
  }

  isInBounds(pos: Position) {
    return (
      0 <= pos.x && pos.x < this.width && 0 <= pos.y && pos.y < this.height
    );
  }

  itemAt(pos: Position) {
    assert(this.isInBounds(pos), `pos ${pos.toString()} is out of bounds`);
    return new GridPosition(this, pos.x, pos.y);
  }

  valueAt(pos: Position) {
    // circular dep if this is a GridPosition (toString prints current value)
    if (pos instanceof GridPosition) {
      pos = pos.toPosition();
    }
    assert(this.isInBounds(pos), `pos ${pos.toString()} is out of bounds`);
    return this.items[pos.y][pos.x];
  }

  itemAtOrNull(pos: Position) {
    if (!this.isInBounds(pos)) {
      return null;
    }

    return new GridPosition(this, pos.x, pos.y);
  }

  setValue(pos: Position, value: PosValue) {
    assert(this.isInBounds(pos), `pos ${pos.toString()} is out of bounds`);
    this.items[pos.y][pos.x] = value;
  }

  print() {
    for (const row of this.items) {
      console.log(row.join(""));
    }
  }
}
