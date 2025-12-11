import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day11a, day11b } from "./11";

describe("day11", () => {
  const sampleInput1 = fs.readFileSync("11/example-input-1.txt").toString("utf-8");
  const sampleInput2 = fs.readFileSync("11/example-input-2.txt").toString("utf-8");
  const input = fs.readFileSync("11/input.txt").toString("utf-8");

  it("11a sample input", () => {
    const answer = day11a(sampleInput1);
    assert.equal(answer, 5);
  });

  it("11a input", () => {
    const answer = day11a(input);
    assert.equal(answer, 448);
  });

  it("11b sample input", () => {
    const answer = day11b(sampleInput2);
    assert.equal(answer, 2);
  });

  it("11b input", () => {
    const answer = day11b(input);
    assert.equal(answer, 553204221431080);
  });
});
