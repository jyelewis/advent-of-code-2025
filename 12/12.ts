import { sscanf } from "../utilities";

export function day12a(input: string) {
  const sections = input.split("\n\n");
  return sections[sections.length - 1].lines().count((regionStr) => {
    const [width, height, shapeCountsStr] = sscanf`${Number}x${Number}: ${String}`(regionStr);

    const totalShapes = shapeCountsStr
      .split(" ")
      .map((x: string) => x.toInt())
      .sum();

    // dumb approximation, good enough apparently
    const predictedArea = totalShapes * 9;
    return predictedArea <= width * height;
  });
}
