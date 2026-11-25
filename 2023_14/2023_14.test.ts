import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_14a, day2023_14b } from "./2023_14";

describe("day2023_14", () => {
  const sampleInput = fs.readFileSync("2023_14/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_14/input.txt").toString("utf-8");

  it("2023_14a sample input", () => {
    const answer = day2023_14a(sampleInput);
    assert.equal(answer, 136);
  });

  it("2023_14a input", () => {
    const answer = day2023_14a(input);
    assert.equal(answer, 108857);
  });

  it("2023_14b sample input", () => {
    const answer = day2023_14b(sampleInput);
    assert.equal(answer, 64);
  });

  it("2023_14b input", () => {
    const answer = day2023_14b(input);
    assert.equal(answer, 95273);
  });
});
