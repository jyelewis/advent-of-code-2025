import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day09a, day09b } from "./09";

describe("day09", () => {
  const sampleInput = fs.readFileSync("09/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("09/input.txt").toString("utf-8");

  it("09a sample input", () => {
    const answer = day09a(sampleInput);
    assert.equal(answer, 50);
  });

  it("09a input", () => {
    const answer = day09a(input);
    assert.equal(answer, 4745816424);
  });

  it("09b sample input", () => {
    const answer = day09b(sampleInput);
    assert.equal(answer, 24);
  });

  it("09b input", () => {
    const answer = day09b(input);
    assert.equal(answer, 1351617690);
  });
});
