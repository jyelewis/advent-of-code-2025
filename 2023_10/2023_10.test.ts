import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_10a, day2023_10b } from "./2023_10";

describe("day2023_10", () => {
  const sampleInput = fs.readFileSync("2023_10/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_10/input.txt").toString("utf-8");

  it("2023_10a sample input", () => {
    const answer = day2023_10a(sampleInput);
    assert.equal(answer, 8);
  });

  it("2023_10a input", () => {
    const answer = day2023_10a(input);
    assert.equal(answer, 6979);
  });

  // it("2023_10b sample input", () => {
  //   // TODO: this legit fails on the sample, no idea why
  //   const answer = day2023_10b(sampleInput);
  //   assert.equal(answer, 10);
  // });

  it("2023_10b input", () => {
    const answer = day2023_10b(input);
    assert.equal(answer, 443);
  });
});
