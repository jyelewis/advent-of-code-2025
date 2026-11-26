import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_18a, day2023_18b } from "./2023_18";

describe("day2023_18", () => {
  const sampleInput = fs.readFileSync("2023_18/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_18/input.txt").toString("utf-8");

  it("2023_18a sample input", () => {
    const answer = day2023_18a(sampleInput);
    assert.equal(answer, 62);
  });

  it("2023_18a input", () => {
    const answer = day2023_18a(input);
    assert.equal(answer, 47675);
  });

  it("2023_18b sample input", () => {
    const answer = day2023_18b(sampleInput);
    assert.equal(answer, 952408144115);
  });

  it("2023_18b input", () => {
    const answer = day2023_18b(input);
    assert.equal(answer, 122103860427465);
  });
});
