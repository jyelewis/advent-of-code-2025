import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_17a, day2023_17b } from "./2023_17";

describe("day2023_17", () => {
  const sampleInput = fs.readFileSync("2023_17/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_17/input.txt").toString("utf-8");

  it("2023_17a sample input", () => {
    const answer = day2023_17a(sampleInput);
    assert.equal(answer, 102);
  });

  it("2023_17a input", () => {
    const answer = day2023_17a(input);
    assert.equal(answer, 870);
  });

  it("2023_17b sample input", () => {
    const answer = day2023_17b(sampleInput);
    assert.equal(answer, 94);
  });

  it("2023_17b input", () => {
    const answer = day2023_17b(input);

    assert.equal(answer, 1063);
  });
});
