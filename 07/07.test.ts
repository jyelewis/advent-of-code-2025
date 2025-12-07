import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day07 } from "./07";

describe("day07", () => {
  const sampleInput = fs.readFileSync("07/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("07/input.txt").toString("utf-8");

  it("07 sample input", () => {
    const { partA, partB } = day07(sampleInput);
    assert.equal(partA, 21);
    assert.equal(partB, 40);
  });

  it("07 input", () => {
    const { partA, partB } = day07(input);
    assert.equal(partA, 1602);
    assert.equal(partB, 135656430050438);
  });
});
