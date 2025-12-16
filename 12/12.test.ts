import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day12a } from "./12";

describe("day12", () => {
  const input = fs.readFileSync("12/input.txt").toString("utf-8");

  it("12a input", () => {
    const answer = day12a(input);
    assert.equal(answer, 476);
  });
});
