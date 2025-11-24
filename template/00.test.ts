import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day00a, day00b } from "./00";

describe("day00", () => {
  const sampleInput = fs.readFileSync("template/example-input.txt").toString("utf-8");
  const input = fs.readFileSync("template/input.txt").toString("utf-8");

  it("00a sample input", () => {
    const answer = day00a(sampleInput);
    assert.equal(answer, 123);
  });

  it("00a input", () => {
    const answer = day00a(input);
    assert.equal(answer, 123);
  });

  it("00b sample input", () => {
    const answer = day00b(sampleInput);
    assert.equal(answer, 123);
  });

  it("00b input", () => {
    const answer = day00b(input);
    assert.equal(answer, 123);
  });
});
