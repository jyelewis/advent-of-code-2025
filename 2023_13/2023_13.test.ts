import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_13a, day2023_13b } from "./2023_13";

describe("day2023_13", () => {
  const sampleInput = fs.readFileSync("2023_13/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_13/input.txt").toString("utf-8");

  it("2023_13a sample input", () => {
    const answer = day2023_13a(sampleInput);
    assert.equal(answer, 405);
  });

  it("2023_13a input", () => {
    const answer = day2023_13a(input);
    assert.equal(answer, 27742);
  });

  it("2023_13b sample input", () => {
    const answer = day2023_13b(sampleInput);
    assert.equal(answer, 400);
  });

  it("2023_13b input", () => {
    const answer = day2023_13b(input);
    assert.equal(answer, 32728);
  });
});
