import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day10a, day10b } from "./10";

describe("day10", () => {
  const sampleInput = fs.readFileSync("10/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("10/input.txt").toString("utf-8");

  it("10a sample input", () => {
    const answer = day10a(sampleInput);
    assert.equal(answer, 7);
  });

  it("10a input", () => {
    const answer = day10a(input);
    assert.equal(answer, 477);
  });

  it("10b sample input", () => {
    const answer = day10b(sampleInput);
    assert.equal(answer, 33);
  });

  it("10b input", () => {
    const answer = day10b(input);
    assert.equal(answer, 123);
  });
});
