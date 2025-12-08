import { range, sscanf } from "../utilities";
import assert from "node:assert";

type Point3D = [number, number, number];

export function day08a(input: string, isExample = false) {
  const junctionBoxes = input.lines().map(sscanf`${Number},${Number},${Number}`) as Point3D[];

  const wires = new Set<string>();
  const addWire = (a: Point3D, b: Point3D) => {
    wires.add(lineKey(a, b));
    wires.add(lineKey(b, a));
  };

  function closestPoints(points: Point3D[]): [Point3D, Point3D] {
    let minDistance = Infinity;
    let closestPair: [Point3D, Point3D] = [points[0], points[0]];

    for (let i = 0; i < points.length; i++) {
      // check one triangle of the matrix only
      for (let j = i + 1; j < points.length; j++) {
        const dist = distanceBetween(points[i], points[j]);
        if (dist < minDistance && !wires.has(lineKey(points[i], points[j]))) {
          minDistance = dist;
          closestPair = [points[i], points[j]];
        }
      }
    }

    return closestPair;
  }

  for (const i of range(isExample ? 10 : 1000)) {
    const [pointA, pointB] = closestPoints(junctionBoxes);
    addWire(pointA, pointB);
  }

  // review our wires, group into networks
  const networks: Point3D[][] = [];
  for (const wire of wires.values()) {
    const [wire1, wire2] = wire.split("->").map((part) => part.split(",").map(Number) as Point3D);
    const networkContainingWire1 = networks.find((network) => network.some((point) => posEqual(point, wire1)));
    const networkContainingWire2 = networks.find((network) => network.some((point) => posEqual(point, wire2)));

    if (networkContainingWire1 && networkContainingWire2) {
      if (networkContainingWire1 !== networkContainingWire2) {
        // merge networks
        networkContainingWire1.push(...networkContainingWire2);
        networks.splice(networks.indexOf(networkContainingWire2), 1);
      }
    } else if (networkContainingWire1) {
      networkContainingWire1.push(wire2);
    } else if (networkContainingWire2) {
      networkContainingWire2.push(wire1);
    } else {
      // create a new network containing these two loner devices
      networks.push([wire1, wire2]);
    }
  }

  // TODO: add items not in a network?

  return networks
    .map((n) => n.length)
    .toSorted((a, b) => b - a)
    .slice(0, 3)
    .product();
}

function distanceBetween(a: Point3D, b: Point3D) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function lineKey(a: Point3D, b: Point3D) {
  return `${a[0]},${a[1]},${a[2]}->${b[0]},${b[1]},${b[2]}`;
}

function posEqual(a: Point3D, b: Point3D) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function posKey(a: Point3D) {
  return `${a[0]},${a[1]},${a[2]}`;
}

export function day08b(input: string) {
  const junctionBoxes = input.lines().map(sscanf`${Number},${Number},${Number}`) as Point3D[];

  const wires = new Set<string>();
  const addWire = (a: Point3D, b: Point3D) => {
    wires.add(lineKey(a, b));
    wires.add(lineKey(b, a));
  };

  function closestPoints(points: Point3D[]): [Point3D, Point3D] {
    let minDistance = Infinity;
    let closestPair: [Point3D, Point3D] = [points[0], points[0]];

    for (let pointA of points) {
      for (let pointB of points) {
        const dist = distanceBetween(pointA, pointB);
        if (dist < minDistance && !wires.has(lineKey(pointA, pointB))) {
          minDistance = dist;
          closestPair = [pointA, pointB];
        }
      }
    }

    return closestPair;
  }

  const networks: Point3D[][] = [];
  const pointsInNetworks = new Set<string>();
  while (true) {
    const [pointA, pointB] = closestPoints(junctionBoxes);
    assert(pointA !== undefined);
    assert(pointB !== undefined);

    addWire(pointA, pointB);
    pointsInNetworks.add(posKey(pointA));
    pointsInNetworks.add(posKey(pointB));

    const networkContainingPointA = networks.find((network) => network.some((point) => posEqual(point, pointA)));
    const networkContainingPointB = networks.find((network) => network.some((point) => posEqual(point, pointB)));

    if (networkContainingPointA && networkContainingPointB) {
      if (networkContainingPointA !== networkContainingPointB) {
        // merge networks
        networkContainingPointA.push(...networkContainingPointB);
        networks.splice(networks.indexOf(networkContainingPointB), 1);
        // console.log(pointA, pointB, pointA[0] * pointB[0]);
        // console.log(networks.length, junctionBoxes.length, pointsInNetworks.size);
        if (networks.length === 1 && pointsInNetworks.size === junctionBoxes.length) {
          return pointA[0] * pointB[0];
        }
      }
    } else if (networkContainingPointA) {
      networkContainingPointA.push(pointB);
      if (networks.length === 1 && pointsInNetworks.size === junctionBoxes.length) {
        return pointA[0] * pointB[0];
      }
    } else if (networkContainingPointB) {
      networkContainingPointB.push(pointA);
      if (networks.length === 1 && pointsInNetworks.size === junctionBoxes.length) {
        return pointA[0] * pointB[0];
      }
    } else {
      // create a new network containing these two loner devices
      networks.push([pointA, pointB]);
    }
  }
}
