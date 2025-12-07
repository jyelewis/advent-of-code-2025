import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day07a, day07b } from "./07";

describe("day07", () => {
  const sampleInput = fs.readFileSync("07/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("07/input.txt").toString("utf-8");

  it("07a sample input", () => {
    const answer = day07a(sampleInput);
    assert.equal(answer, 21);
  });

  it("07a input", () => {
    const answer = day07a(input);
    assert.equal(answer, 1602);
  });

  it("07b sample input", () => {
    const answer = day07b(sampleInput);
    assert.equal(answer, 40);
  });

  it("07b input", () => {
    const answer = day07b(input);
    assert.equal(answer, 135656430050438);
  });
});
