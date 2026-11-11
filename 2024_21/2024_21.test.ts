import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2024_21a, day2024_21b } from "./2024_21";

describe("day2024_21", () => {
  const sampleInput = fs.readFileSync("2024_21/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2024_21/input.txt").toString("utf-8");

  it("2024_21a sample input", () => {
    const answer = day2024_21a(sampleInput);
    assert.equal(answer, 126384);
  });

  it("2024_21a input", () => {
    const answer = day2024_21a(input);
    assert.equal(answer, 202648);
  });

  it("2024_21b sample input", () => {
    const answer = day2024_21b(sampleInput);
    assert.equal(answer, 154115708116294);
  });

  it("2024_21b input", () => {
    const answer = day2024_21b(input);
    assert.equal(answer, 248919739734728);
  });
});
