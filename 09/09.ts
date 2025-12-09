import { sscanf } from "../utilities";
import * as turf from "@turf/turf";
import * as de9im from "de9im";

export function day09(input: string) {
  // parse all red tile coordinates into Array<{x, y}>;
  const redTiles = input.lines().map((line) => {
    const [x, y] = sscanf`${Number},${Number}`(line);
    return { x, y };
  });

  // generate all possible rectangles from these red tiles as corners
  const allRects = [];
  for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
      const tileA = redTiles[i]!;
      const tileB = redTiles[j]!;
      const area = (Math.abs(tileA.x - tileB.x) + 1) * (Math.abs(tileA.y - tileB.y) + 1);

      allRects.push({
        tileA,
        tileB,
        area,
      });
    }
  }

  // sort by largest area
  allRects.sort((a, b) => b.area - a.area);

  // part A: the largest possible rectangle from these corners
  const largestRect = allRects[0]!;

  // part B: the largest rectangle fully contained within the polygon
  // connect all our red tiles into a polygon (also wrap the last to the first)
  const fullPolygon = turf.polygon([[...redTiles.map((t) => [t.x, t.y]), [redTiles[0]!.x, redTiles[0]!.y]]]);
  const largestInternalRect = allRects
    // optimisation from visualising: we know the vertexes must be in the same half of the circle
    .filter(({ tileA, tileB }) => tileA.y < 50000 === tileB.y < 50000)
    // post solution optimisation
    .filter(({ tileA }) => tileA.x < 5000)
    // find the first rectangle fully contained within the polygon
    .find(({ tileA, tileB }) =>
      de9im.contains(
        fullPolygon,
        turf.polygon([
          [
            [tileA.x, tileA.y],
            [tileA.x, tileB.y],
            [tileB.x, tileB.y],
            [tileB.x, tileA.y],
            [tileA.x, tileA.y],
          ],
        ]),
      ),
    )!;

  return {
    partA: largestRect.area,
    partB: largestInternalRect.area,
  };
}
