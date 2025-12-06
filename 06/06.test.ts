import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day06a, day06b } from "./06";

describe("day06", () => {
  const sampleInput = fs.readFileSync("06/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("06/input.txt").toString("utf-8");

  it("06a sample input", () => {
    const answer = day06a(sampleInput);
    assert.equal(answer, 4277556);
  });

  it("06a input", () => {
    const answer = day06a(input);
    assert.equal(answer, 6169101504608);
  });

  it("06b sample input", () => {
    const answer = day06b(sampleInput);
    assert.equal(answer, 123);
  });

  it("06b input", () => {
    const answer = day06b(input);
    assert.equal(answer, 123);
  });
});
