import { sscanf } from "../utilities";

interface JunctionBox {
  x: number;
  y: number;
  z: number;
  network: null | number;
}

export function day08(input: string, isExample = false) {
  const junctionBoxes = input.lines().map((line) => {
    const [x, y, z] = sscanf`${Number},${Number},${Number}`(line);
    return {
      x,
      y,
      z,
      network: null,
    } as JunctionBox;
  });

  // compute every pairwise distance
  const boxPairs: Array<{ boxA: JunctionBox; boxB: JunctionBox; distance: number }> = [];
  // only compute one triangle of the distance matrix
  for (let i = 0; i < junctionBoxes.length; i++) {
    for (let j = i + 1; j < junctionBoxes.length; j++) {
      const boxA = junctionBoxes[i];
      const boxB = junctionBoxes[j];
      const distance = (boxA.x - boxB.x) ** 2 + (boxA.y - boxB.y) ** 2 + (boxA.z - boxB.z) ** 2;

      boxPairs.push({ boxA, boxB, distance });
    }
  }
  boxPairs.sort((a, b) => a.distance - b.distance);

  let partA: null | number = null;
  let partB: null | number = null;

  for (const [connectionIndex, { boxA, boxB }] of boxPairs.entries()) {
    if (boxA.network === boxB.network && boxA.network !== null) {
      // already in the same network
      continue;
    }

    if (boxA.network === null && boxB.network === null) {
      // create new network - use current connectionIndex as unique network id
      const newNetworkId = connectionIndex;
      boxA.network = newNetworkId;
      boxB.network = newNetworkId;
    }

    if (boxA.network !== null && boxB.network === null) {
      boxB.network = boxA.network;
    }

    if (boxA.network === null && boxB.network !== null) {
      boxA.network = boxB.network;
    }

    if (boxA.network !== null && boxB.network !== null && boxA.network !== boxB.network) {
      // both in different networks, need to merge
      const networkToKeep = boxA.network;
      const networkToMerge = boxB.network;
      for (let box of junctionBoxes) {
        if (box.network === networkToMerge) {
          box.network = networkToKeep;
        }
      }
    }

    const connectionsMade = connectionIndex + 1;
    if (connectionsMade === (isExample ? 10 : 1000)) {
      // part a checkpoint
      // count the size of the top 3 networks
      partA = junctionBoxes
        .filter((box) => box.network !== null)
        .groupBy((box) => box.network)
        .values()
        .map((boxesInNetwork) => boxesInNetwork.length)
        .toArray()
        .toSorted((a, b) => b - a)
        .slice(0, 3)
        .product();
    }

    // count the number of unique networks
    const allBoxesInSameNetwork = junctionBoxes.every((box) => box.network === boxA.network);
    if (allBoxesInSameNetwork) {
      partB = boxA.x * boxB.x;
      break;
    }
  }

  return {
    partA,
    partB,
  };
}
