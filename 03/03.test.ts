import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day03 } from "./03";

describe("day03", () => {
  const sampleInput = fs.readFileSync("03/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("03/input.txt").toString("utf-8");

  it("03 sample input", () => {
    const { partA, partB } = day03(sampleInput);
    assert.equal(partA, 357);
    assert.equal(partB, 3121910778619);
  });

  it("03 input", () => {
    const { partA, partB } = day03(input);
    assert.equal(partA, 16993);
    assert.equal(partB, 168617068915447);
  });
});
