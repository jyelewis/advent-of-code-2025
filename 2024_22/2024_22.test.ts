import { describe, it } from "node:test";
import fs from "fs";
import assert from "node:assert";
import { day2024_22a, day2024_22b, nextSecretNumber } from "./2024_22";

describe("day2024_22", () => {
  const sampleInputA = fs.readFileSync("2024_22/example-input-a.txt").toString("utf-8");
  const sampleInputB = fs.readFileSync("2024_22/example-input-b.txt").toString("utf-8");
  const input = fs.readFileSync("2024_22/input.txt").toString("utf-8");

  it("2024_22a sample input", () => {
    const answer = day2024_22a(sampleInputA);
    assert.equal(answer, 37327623);
  });

  it("2024_22a input", () => {
    const answer = day2024_22a(input);
    assert.equal(answer, 18525593556);
  });

  it("2024_22b sample input", () => {
    const answer = day2024_22b(sampleInputB);
    assert.equal(answer, 23);
  });

  it("2024_22b input", () => {
    console.time("aaaa");
    const answer = day2024_22b(input);
    console.timeEnd("aaaa");
    assert.equal(answer, 2089);
  });

  it("generates secret number", () => {
    let number = 123;
    const secretNumbers = [15887950, 16495136, 527345, 704524, 1553684, 12683156, 11100544, 12249484, 7753432, 5908254];

    for (const expectedNext of secretNumbers) {
      number = nextSecretNumber(number);
      assert.equal(number, expectedNext);
    }
  });
});
