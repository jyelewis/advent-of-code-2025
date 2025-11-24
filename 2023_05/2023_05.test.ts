import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_05a, day2023_05b } from "./2023_05";

describe("day2023_05", () => {
  const sampleInput = fs.readFileSync("2023_05/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_05/input.txt").toString("utf-8");

  it("2023_05a sample input", () => {
    const answer = day2023_05a(sampleInput);
    assert.equal(answer, 123);
  });

  it("2023_05a input", () => {
    const answer = day2023_05a(input);
    assert.equal(answer, 123);
  });

  it("2023_05b sample input", () => {
    const answer = day2023_05b(sampleInput);
    assert.equal(answer, 123);
  });

  it("2023_05b input", () => {
    const answer = day2023_05b(input);
    assert.equal(answer, 123);
  });
});
