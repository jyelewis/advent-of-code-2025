import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2023_12a, day2023_12b, day2023_12b_mutations } from "./2023_12";

describe("day2023_12", () => {
  const sampleInput = fs.readFileSync("2023_12/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2023_12/input.txt").toString("utf-8");

  it("2023_12a sample input", () => {
    const answer = day2023_12a(sampleInput);
    assert.equal(answer, 21);
  });

  it("2023_12a input", () => {
    console.time("12a");
    const answer = day2023_12a(input);
    console.timeEnd("12a");
    assert.equal(answer, 7718);
  });

  it.skip("2023_12b sample input", () => {
    console.time("aaaa");
    const answer = day2023_12b(sampleInput);
    console.timeEnd("aaaa");
    assert.equal(answer, 525152);
  });

  it.skip("2023_12b sample input mutations", () => {
    console.time("aaaa");
    const answer = day2023_12b_mutations(sampleInput);
    console.timeEnd("aaaa");
    assert.equal(answer, 525152);
  });

  it.skip("2023_12b input mutations", () => {
    // console.time("aaaa");
    const answer = day2023_12b_mutations(input);
    // console.timeEnd("aaaa");
    assert.equal(answer, 123);
  });

  it.skip("2023_12b input", () => {
    const answer = day2023_12b(input);
    assert.equal(answer, 123);
  });

  it.skip("2023_12a test input", () => {
    const testInput = fs.readFileSync("2023_12/test-input.txt").toString("utf-8");
    const answer = day2023_12a(testInput);
    assert.equal(answer, 1);
  });
});
