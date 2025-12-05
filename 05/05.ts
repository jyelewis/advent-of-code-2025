import { sscanf } from "../utilities";

export function day05a(input: string) {
  const [freshRangesStr, ingredientIdsStr] = input.split("\n\n");

  const freshRanges = freshRangesStr.lines().map((line) => sscanf`${Number}-${Number}`(line));
  const ingredientIds = ingredientIdsStr.lines().map((line) => line.toInt());

  return ingredientIds.count((id) => freshRanges.some(([from, to]) => id >= from && id <= to));
}

export function day05b(input: string) {
  const [freshRangesStr] = input.split("\n\n");

  let existingRanges: Array<{ from: number; to: number }> = [];
  freshRangesStr.lines().map((line) => {
    const [from, to] = sscanf`${Number}-${Number}`(line);

    const overlappingRanges = existingRanges.filter(
      (existingRange) => existingRange.from <= to && existingRange.to >= from,
    );
    const notOverlappingRanges = existingRanges.filter(
      (existingRange) => !(existingRange.from <= to && existingRange.to >= from),
    );

    const overlappingFrom = Math.min(...overlappingRanges.map((r) => r.from), from);
    const overlappingTo = Math.max(...overlappingRanges.map((r) => r.to), to);

    existingRanges = [...notOverlappingRanges, { from: overlappingFrom, to: overlappingTo }];
  });

  return existingRanges.map((range) => range.to - range.from + 1).sum();
}
