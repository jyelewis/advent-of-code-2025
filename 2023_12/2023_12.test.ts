import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_12a, day2023_12b } from "./2023_12";

describe("day2023_12", () => {
  const sampleInput = fs.readFileSync("2023_12/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_12/input.txt").toString("utf-8");

  it("2023_12a sample input", () => {
    const answer = day2023_12a(sampleInput);
    assert.equal(answer, 21);
  });

  it("2023_12a input", () => {
    const answer = day2023_12a(input);
    assert.equal(answer, 7718);
  });

  it("2023_12b sample input", () => {
    const answer = day2023_12b(sampleInput);
    assert.equal(answer, 525152);
  });

  it("2023_12b input", () => {
    const answer = day2023_12b(input);
    assert.equal(answer, 128741994134728);
  });
});
