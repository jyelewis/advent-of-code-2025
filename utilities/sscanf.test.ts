import { describe, it } from "node:test";
import assert from "node:assert";
import { sscanf } from "./sscanf";

describe("sscanf", () => {
  it("Number_Number", () => {
    const result = sscanf`${Number}_${Number}`("123_456");
    assert.deepEqual(result, [123, 456]);
  });

  it("Number_String", () => {
    const result = sscanf`${Number}_${String}`("123_abcd");
    assert.deepEqual(result, [123, "abcd"]);
  });

  it("String-String", () => {
    const result = sscanf`${String}-${String}`("hello-world");
    assert.deepEqual(result, ["hello", "world"]);
  });

  it("Person details", () => {
    const result = sscanf`Name: ${String}; age: ${Number}; height: ${Number}cm`("Name: Buster; age: 39; height: 184cm");
    assert.deepEqual(result, ["Buster", 39, 184]);
  });

  it("Floating point numbers", () => {
    const result = sscanf`Value: ${Number}`("Value: 12.34");
    assert.deepEqual(result, [12.34]);
  });

  it("Error: Mismatch start", () => {
    assert.throws(
      () => sscanf`Start: ${Number}`("End: 123"),
      /Failed to parse, was expecting "Start: " but got "End: 123"/,
    );
  });

  it("Error: Mismatch number", () => {
    assert.throws(
      () => sscanf`Value: ${Number}`("Value: abc"),
      /Failed to parse, was expecting a number but got "abc"/,
    );
  });

  it("Error: Missing string delimiter", () => {
    assert.throws(
      () => sscanf`Start: ${String}; End`("Start: content without delimiter"),
      /Failed to parse, was expecting a string followed by "; End" but got "content without delimiter"/,
    );
  });

  it("Error: Mismatch end", () => {
    assert.throws(
      () => sscanf`Value: ${Number} end`("Value: 123 start"),
      /Failed to parse, was expecting " end" at the end but got " start"/,
    );
  });

  it("Error: Unknown type", () => {
    assert.throws(() => sscanf`Value: ${Boolean}`("Value: true"), /Unknown type:/);
  });
});
