import { memo } from "../utilities";

export function day11(input: string) {
  const nodes = input
    .lines()
    .map((line) => line.split(":"))
    .map(([nodeId, outputsStr]) => ({
      nodeId,
      outputs: outputsStr.trim().split(" "),
    }));

  const countPathsFromNode = memo((nodeId: string, requiredNodes: string[] = []): number => {
    if (nodeId === "out") {
      // this is a valid path! (if we have no required nodes that have not been hit yet)
      return requiredNodes.length === 0 ? 1 : 0;
    }

    // as we pass required nodes, remove them from out pending list
    requiredNodes = requiredNodes.filter((x) => x !== nodeId);

    // recursive DFS
    return nodes
      .findOne((node) => node.nodeId === nodeId)
      .outputs.map((outputNodeId) => countPathsFromNode(outputNodeId, requiredNodes))
      .sum();
  });

  return {
    partA: countPathsFromNode("you"),
    partB: countPathsFromNode("svr", ["dac", "fft"]),
  };
}
