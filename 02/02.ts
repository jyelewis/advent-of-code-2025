import { range, sscanf } from "../utilities";

export function day02a(input: string) {
  return input
    .split(",")
    .map(sscanf`${Number}-${Number}`)
    .flatMap(([start, end]) => range(start, end))
    .filter((id) => {
      const idStr = id.toString();
      const idHalf1 = idStr.substring(0, idStr.length / 2);
      const idHalf2 = idStr.substring(idStr.length / 2);
      return idHalf1 === idHalf2;
    })
    .sum();
}

export function day02b(input: string) {
  return input
    .split(",")
    .map(sscanf`${Number}-${Number}`)
    .flatMap(([start, end]) => range(start, end))
    .filter((id) => {
      const idStr = id.toString();

      // determine if idStr has any pattern that repeats
      for (const patternLength of range(1, idStr.length / 2)) {
        let repeatedPattern = idStr.substring(0, patternLength).repeat(idStr.length / patternLength);
        if (repeatedPattern === idStr) {
          return true;
        }
      }
    })
    .sum();
}
