// quick & dirty index array generator

import assert from "node:assert";

export function range(size: number): number[];
export function range(from: number, to: number, step?: number): number[];
export function range(fromOrSize: number, to?: number, step = 1): number[] {
  assert(step !== 0, "step must not be zero");

  const from = to !== undefined ? fromOrSize : 0;
  const realTo = to !== undefined ? to : fromOrSize - 1;

  const arr: number[] = [];

  // Handle both positive and negative steps
  if (step > 0) {
    for (let i = from; i <= realTo; i += step) {
      arr.push(i);
    }
  } else if (step < 0) {
    for (let i = from; i >= realTo; i += step) {
      arr.push(i);
    }
  }

  return arr;
}
