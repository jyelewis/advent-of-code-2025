import { range } from "../utilities";

export function day02a(input: string) {
  const productIdRanges = input.split(",").map((rangeStr) => {
    const [firstId, lastId] = rangeStr.split("-").map(Number);
    return { firstId, lastId };
  });

  const allIds = productIdRanges.flatMap((productIdRange) => {
    const allIdsInRange = range(productIdRange.firstId, productIdRange.lastId);
    return allIdsInRange;
  });

  const invalidIds = allIds.filter((id) => {
    const idStr = id.toString();
    if (idStr.length % 2 !== 0) {
      // odd lengths cant be invalid
      return;
    }
    const idHalf1 = idStr.substring(0, idStr.length / 2);
    const idHalf2 = idStr.substring(idStr.length / 2);
    return idHalf1 === idHalf2;
  });

  return invalidIds.sum();
}

export function day02b(input: string) {
  const productIdRanges = input.split(",").map((rangeStr) => {
    const [firstId, lastId] = rangeStr.split("-").map(Number);
    return { firstId, lastId };
  });

  const allIds = productIdRanges.flatMap((productIdRange) => {
    const allIdsInRange = range(productIdRange.firstId, productIdRange.lastId);
    return allIdsInRange;
  });

  const invalidIds = allIds.filter((id) => {
    const idStr = id.toString();

    // deturmine if idStr has any pattern that repeats
    for (let patternLength = 1; patternLength <= idStr.length / 2; patternLength++) {
      const pattern = idStr.substring(0, patternLength);
      let repeatedPattern = "";
      while (repeatedPattern.length < idStr.length) {
        repeatedPattern += pattern;
      }
      if (repeatedPattern === idStr) {
        return true;
      }
    }
  });

  return invalidIds.sum();
}
