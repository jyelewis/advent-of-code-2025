import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day11 } from "./11";

describe("day11", () => {
  const input = fs.readFileSync("11/input.txt").toString("utf-8");
  it("11 input", () => {
    const { partA, partB } = day11(input);
    assert.equal(partA, 448);
    assert.equal(partB, 553204221431080);
  });
});
