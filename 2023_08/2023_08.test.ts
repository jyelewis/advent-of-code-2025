import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_08 } from "./2023_08";

describe("day2023_08", () => {
  const sampleInput = fs.readFileSync("2023_08/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_08/input.txt").toString("utf-8");

  it("2023_08a sample input", () => {
    const { partA } = day2023_08(sampleInput);
    assert.equal(partA, 6);
  });

  it("2023_08a input", () => {
    const { partA } = day2023_08(input);
    assert.equal(partA, 14429);
  });

  it("2023_08b sample input", () => {
    const { partB } = day2023_08(sampleInput);
    assert.equal(partB, 6);
  });

  it("2023_08b input", () => {
    const { partB } = day2023_08(input);
    assert.equal(partB, 10921547990923);
  });
});
