import { range } from "../utilities";

export function day06(input: string) {
  const lines = input.lines();
  const numLines = lines.slice(0, -1);
  const operationsLine = lines[lines.length - 1];

  // extract each expression i.e.
  // -----
  // 64
  // 23
  // 314
  // +
  // -----
  // becomes: { operation: "+", numStrings: ["64 ", "23 ", "314"] }
  const expressions = operationsLine
    .matchAll(/[*+] +/g)
    .toArray()
    .map((regexArr) => {
      const operationWithSpaces = regexArr[0];

      // use the location of the operation to find the starting location of this column
      const startCol = regexArr.index!;
      const endCol = startCol + operationWithSpaces.length - 1;

      return {
        operation: operationWithSpaces.trim(),
        // iterate vertically down the column for this operation to get all the number strings
        numStrings: numLines.map((numLine) => numLine.substring(startCol, endCol)),
      };
    });

  const partA = expressions
    .map((exp) => {
      const nums = exp.numStrings.map((x) => x.trim().toInt());

      switch (exp.operation) {
        case "+":
          return nums.sum();
        case "*":
          return nums.product();
      }
    })
    .sum();

  const partB = expressions
    .map((exp) => {
      const nums = range(exp.numStrings[0].length).map((digitIndex) =>
        exp.numStrings
          // extract digit from correct column of each numStr
          .map((numStr) => numStr.charAt(numStr.length - digitIndex - 1))
          // remove empty spaces
          .filter((numChar) => numChar !== " ")
          // convert back to number
          .join("")
          .toInt(),
      );

      switch (exp.operation) {
        case "+":
          return nums.sum();
        case "*":
          return nums.product();
      }
    })
    .sum();

  return { partA, partB };
}
