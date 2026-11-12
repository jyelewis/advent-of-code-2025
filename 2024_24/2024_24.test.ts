import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2024_24a, day2024_24b, renderGraph } from "./2024_24";

describe("day2024_24", () => {
  const sampleInput = fs.readFileSync("2024_24/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("2024_24/input.txt").toString("utf-8");
  const inputFixed = fs.readFileSync("2024_24/input_fixed.txt").toString("utf-8");

  it("2024_24a sample input", () => {
    const answer = day2024_24a(sampleInput);
    assert.equal(answer, 2024);
  });

  it("2024_24a input", () => {
    const answer = day2024_24a(input);
    assert.equal(answer, 57632654722854);
  });

  it.skip("2024_24b sample input", () => {
    const answer = day2024_24b(sampleInput);
    assert.equal(answer, 123);
  });

  it.skip("2024_24b input", () => {
    // "dbp,fdv,kdf,rfg,z15,z15,z23,z39" is wrong
    const answer = day2024_24b(input);
    assert.equal(answer, 123);
  });

  it("2024_24b input FIXED manually", () => {
    // "dbp,fdv,kdf,rfg,z15,z15,z23,z39" is wrong
    // "ckj,dbp,fdv,kdf,rfg,z15,z23,z39" is wrong
    // "ckj,dbp,fdv,kdf,rpp,z15,z23,z39" IS RIGHT
    const answer = day2024_24b(inputFixed);
    assert.equal(answer, "ckj,dbp,fdv,kdf,rpp,z15,z23,z39");
  });

  it.skip("Renders graph", () => {
    renderGraph(input);
  });
});
