import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day08a, day08b } from "./08";

describe("day08", () => {
  const sampleInput = fs.readFileSync("08/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("08/input.txt").toString("utf-8");

  it("08a sample input", () => {
    const answer = day08a(sampleInput, true);
    assert.equal(answer, 40);
  });

  it("08a input", () => {
    const answer = day08a(input, false);
    assert.equal(answer, 62186);
  });

  it("08b sample input", () => {
    const answer = day08b(sampleInput);
    assert.equal(answer, 25272);
  });

  it("08b input", () => {
    const answer = day08b(input);
    assert.equal(answer, 8420405530);
  });
});
