import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_19 } from "./2023_19";

describe("day2023_19", () => {
  const sampleInput = fs.readFileSync("2023_19/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_19/input.txt").toString("utf-8");

  it("2023_19a sample input", () => {
    const { partA } = day2023_19(sampleInput);
    assert.equal(partA, 19114);
  });

  it("2023_19a input", () => {
    const { partA } = day2023_19(input);
    assert.equal(partA, 402185);
  });

  it("2023_19b sample input", () => {
    const { partB } = day2023_19(sampleInput);
    assert.equal(partB, 167409079868000);
  });

  it("2023_19b input", () => {
    const { partB } = day2023_19(input);
    assert.equal(partB, 130291480568730);
  });
});
