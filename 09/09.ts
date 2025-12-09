import { sscanf } from "../utilities";
import * as turf from "@turf/turf";
import * as de9im from "de9im";

export function day09a(input: string) {
  const redTiles = input.lines().map((line) => {
    const [x, y] = sscanf`${Number},${Number}`(line);
    return { x, y };
  });

  let largestArea = 0;
  for (const tileA of redTiles) {
    for (const tileB of redTiles) {
      const area = Math.abs(tileA.x - tileB.x + 1) * Math.abs(tileA.y - tileB.y + 1);
      if (area > largestArea) {
        largestArea = area;
      }
    }
  }

  return largestArea;
}

export function day09b(input: string) {
  const redTiles = input.lines().map((line) => {
    const [x, y] = sscanf`${Number},${Number}`(line);
    return { x, y };
  });

  // connect all our red tiles into a polygon (also wrap the last to the first)
  const fullPolygon = turf.polygon([[...redTiles.map((t) => [t.x, t.y]), [redTiles[0]!.x, redTiles[0]!.y]]]);

  const allInternalRects = [];
  for (const tileA of redTiles) {
    for (const tileB of redTiles) {
      // from visualisation
      if (tileA.y < 50000 !== tileB.y < 50000) {
        //  they must be in the same half of the circle
        continue;
      }

      const area = (Math.abs(tileA.x - tileB.x) + 1) * (Math.abs(tileA.y - tileB.y) + 1);
      allInternalRects.push({
        tileA,
        tileB,
        area,
      });
    }
  }

  const largestInternalRect = allInternalRects
    // check the largest areas first
    .toSorted((a, b) => b.area - a.area)
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

  return largestInternalRect.area;
}
