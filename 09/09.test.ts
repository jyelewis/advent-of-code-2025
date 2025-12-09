import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day09 } from "./09";

describe("day09", () => {
  const sampleInput = fs.readFileSync("09/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("09/input.txt").toString("utf-8");

  it("09 sample input", () => {
    const { partA, partB } = day09(sampleInput);
    assert.equal(partA, 50);
    assert.equal(partB, 24);
  });

  it("09 input", () => {
    const { partA, partB } = day09(input);
    assert.equal(partA, 4745816424);
    assert.equal(partB, 1351617690);
  });
});
