import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_16a, day2023_16b } from "./2023_16";

describe("day2023_16", () => {
  const sampleInput = fs.readFileSync("2023_16/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_16/input.txt").toString("utf-8");

  it("2023_16a sample input", () => {
    const answer = day2023_16a(sampleInput);
    assert.equal(answer, 46);
  });

  it("2023_16a input", () => {
    const answer = day2023_16a(input);
    assert.equal(answer, 6514);
  });

  it("2023_16b sample input", () => {
    const answer = day2023_16b(sampleInput);
    assert.equal(answer, 51);
  });

  it("2023_16b input", () => {
    const answer = day2023_16b(input);
    assert.equal(answer, 8089);
  });
});
