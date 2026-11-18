import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_11 } from "./2023_11";

describe("day2023_11", () => {
  const sampleInput = fs.readFileSync("2023_11/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_11/input.txt").toString("utf-8");

  it("2023_11a sample input", () => {
    const { partA } = day2023_11(sampleInput);
    assert.equal(partA, 374);
  });

  it("2023_11a input", () => {
    const { partA } = day2023_11(input);
    assert.equal(partA, 9805264);
  });

  it("2023_11b sample input", () => {
    const { partB } = day2023_11(sampleInput);
    assert.equal(partB, 82000210);
  });

  it("2023_11b input", () => {
    const { partB } = day2023_11(input);
    assert.equal(partB, 779032247216);
  });
});
