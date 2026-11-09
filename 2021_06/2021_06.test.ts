import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2021_06 } from "./2021_06";

describe("day2021_06", () => {
  const sampleInput = fs.readFileSync("2021_06/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2021_06/input.txt").toString("utf-8");

  it("2021_06a sample input", () => {
    const { partA } = day2021_06(sampleInput);
    assert.equal(partA, 5934);
  });

  it("2021_06a input", () => {
    const { partA } = day2021_06(input);
    assert.equal(partA, 365862);
  });

  it("2021_06b sample input", () => {
    const { partB } = day2021_06(sampleInput);
    assert.equal(partB, 26984457539);
  });

  it("2021_06b input", () => {
    const { partB } = day2021_06(input);
    assert.equal(partB, 1653250886439);
  });
});
