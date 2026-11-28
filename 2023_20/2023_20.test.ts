import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_20a, day2023_20b } from "./2023_20";

describe("day2023_20", () => {
  const sampleInput = fs.readFileSync("2023_20/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_20/input.txt").toString("utf-8");

  it("2023_20a sample input", () => {
    const answer = day2023_20a(sampleInput);
    assert.equal(answer, 32000000);
  });

  it("2023_20a input", () => {
    const answer = day2023_20a(input);
    assert.equal(answer, 821985143);
  });

  it("2023_20b input", () => {
    const answer = day2023_20b(input);
    assert.equal(answer, 240853834793347);
  });
});
