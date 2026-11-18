import { sscanf, lcm } from "../utilities";

export function day2023_08(input: string) {
  // parse input
  const [directionsStr, graphStr] = input.split("\n\n");
  const directions = directionsStr.chars() as Array<"L" | "R">;
  const nodes: Record<string, { L: string; R: string }> = {};
  graphStr.lines().forEach((line) => {
    const [node, L, R] = sscanf`${String} = (${String}, ${String})`(line);
    nodes[node] = { L, R };
  });

  // walk da graph
  const stepsUntilZ = (startNode: string) => {
    let currentNode = startNode;
    let stepCount = 0;
    while (!currentNode.endsWith("Z")) {
      const directionIndex = stepCount % directions.length;
      const direction = directions[directionIndex];
      currentNode = nodes[currentNode][direction];

      stepCount++;
    }

    return stepCount;
  };

  const loopLengths = Object.keys(nodes)
    .filter((x) => x.endsWith("A"))
    .map((node) => stepsUntilZ(node));

  return {
    partA: stepsUntilZ("AAA"),
    partB: lcm(loopLengths),
  };
}
