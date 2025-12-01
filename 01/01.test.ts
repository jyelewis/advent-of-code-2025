import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day01 } from "./01";

describe("day01", () => {
  const sampleInput = fs.readFileSync("01/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("01/input.txt").toString("utf-8");

  it("01 sample input", () => {
    const { partA, partB } = day01(sampleInput);
    assert.equal(partA, 3);
    assert.equal(partB, 6);
  });

  it("01 input", () => {
    const { partA, partB } = day01(input);
    assert.equal(partA, 1152);
    assert.equal(partB, 6671);
  });
});
