import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day06 } from "./06";
import { day06BAlt } from "./06-alt";

describe("day06", () => {
  const sampleInput = fs.readFileSync("06/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("06/input.txt").toString("utf-8");

  it("06 sample input", () => {
    const { partA, partB } = day06(sampleInput);
    assert.equal(partA, 4277556);
    assert.equal(partB, 3263827);
  });

  it("06 input", () => {
    const { partA, partB } = day06(input);
    assert.equal(partA, 6169101504608);
    assert.equal(partB, 10442199710797);
  });

  it("06 sample input - alt", () => {
    const partB = day06BAlt(sampleInput);
    assert.equal(partB, 3263827);
  });
});
