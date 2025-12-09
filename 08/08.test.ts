import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day08 } from "./08";

describe("day08", () => {
  const sampleInput = fs.readFileSync("08/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("08/input.txt").toString("utf-8");

  it("day08 sample input", () => {
    const { partA, partB } = day08(sampleInput, true);
    assert.equal(partA, 40);
    assert.equal(partB, 25272);
  });

  it("day08 input", () => {
    const { partA, partB } = day08(input);
    assert.equal(partA, 62186);
    assert.equal(partB, 8420405530);
  });
});
