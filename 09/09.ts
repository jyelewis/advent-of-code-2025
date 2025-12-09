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

  // optimisation found by visualising the input data
  // not needed, but dramatically speeds up full input

  // we look for the two positions that form the break in the circle
  // we know the largest solution must contain one of these two points as a vertex
  const magicTiles = [];
  let prevTile = redTiles[0];
  for (const tile of redTiles) {
    const xDistance = Math.abs(tile.x - prevTile.x);
    if (xDistance > 10000) {
      // we know the magic tiles are beyond x=50000
      if (prevTile.x > 50_000) {
        magicTiles.push(prevTile);
      }
      if (tile.x > 50_000) {
        magicTiles.push(tile);
      }
    }

    prevTile = tile;
  }

  // if we found them, use them
  // otherwise, continue searching all tiles against all tiles
  let tileAs = magicTiles.length > 0 ? magicTiles : redTiles;

  let largestArea = 0;
  for (const tileA of tileAs) {
    for (const tileB of redTiles) {
      // from visualisation
      if (tileA.y < 50000 !== tileB.y < 50000) {
        //  they must be in the same half of the circle
        continue;
      }

      const rectPolygon = turf.polygon([
        [
          [tileA.x, tileA.y],
          [tileA.x, tileB.y],
          [tileB.x, tileB.y],
          [tileB.x, tileA.y],
          [tileA.x, tileA.y],
        ],
      ]);
      const isWithin = de9im.contains(fullPolygon, rectPolygon);
      if (!isWithin) {
        continue;
      }

      const area = (Math.abs(tileA.x - tileB.x) + 1) * (Math.abs(tileA.y - tileB.y) + 1);
      if (area > largestArea) {
        largestArea = area;
      }
    }
  }

  return largestArea;
}
