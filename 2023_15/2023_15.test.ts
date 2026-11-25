import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_15a, day2023_15b } from "./2023_15";

describe("day2023_15", () => {
  const sampleInput = fs.readFileSync("2023_15/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_15/input.txt").toString("utf-8");

  it("2023_15a sample input", () => {
    const answer = day2023_15a(sampleInput);
    assert.equal(answer, 1320);
  });

  it("2023_15a input", () => {
    const answer = day2023_15a(input);
    assert.equal(answer, 517015);
  });

  it("2023_15b sample input", () => {
    const answer = day2023_15b(sampleInput);
    assert.equal(answer, 145);
  });

  it("2023_15b input", () => {
    const answer = day2023_15b(input);
    assert.equal(answer, 286104);
  });
});
