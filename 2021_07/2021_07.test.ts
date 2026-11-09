import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2021_07 } from "./2021_07";

describe("day2021_07", () => {
  const sampleInput = fs.readFileSync("2021_07/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2021_07/input.txt").toString("utf-8");

  it("2021_07 sample input", () => {
    const answer = day2021_07(sampleInput, false);
    assert.equal(answer, 37);
  });

  it("2021_07a input", () => {
    const answer = day2021_07(input, false);
    assert.equal(answer, 343605);
  });

  it("2021_07b sample input", () => {
    const answer = day2021_07(sampleInput, true);
    assert.equal(answer, 168);
  });

  it("2021_07b input", () => {
    const answer = day2021_07(input, true);
    assert.equal(answer, 96744904);
  });
});
