import { describe, it } from "node:test";
import assert from "node:assert";
import { gcd, lcm } from "./euclideanMultiples";

describe("Euclidean Multiples", () => {
  describe("gcd", () => {
    it("gcd 3s", () => {
      assert.equal(gcd([6, 9]), 3);
      assert.equal(gcd([9, 6]), 3);
      assert.equal(gcd([9, 6, 3]), 3);
      assert.equal(gcd([9, 6, 3, 15]), 3);
      assert.equal(gcd([9, 6, 3]), 3);
      assert.equal(gcd([15, 21]), 3);
    });

    it("gcd 5s", () => {
      assert.equal(gcd([5]), 5);
      assert.equal(gcd([5, 10]), 5);
      assert.equal(gcd([5, 10, 15]), 5);
      assert.equal(gcd([15, 20, 50]), 5);
    });

    it("gcd 10s", () => {
      assert.equal(gcd([10, 20, 30]), 10);
      assert.equal(gcd([90, 100, 200]), 10);
    });

    it("gcd 1s", () => {
      assert.equal(gcd([99, 100]), 1);
      assert.equal(gcd([15, 22]), 1);
    });
  });

  it("lcm", () => {
    assert.equal(lcm([3, 5]), 15);
    assert.equal(lcm([30, 45, 255]), 1530);
    assert.equal(lcm([10, 11]), 110);
    assert.equal(lcm([10, 11, 5]), 110);
    assert.equal(lcm([3793, 3947, 4003, 4019]), 240853834793347);
  });
});
