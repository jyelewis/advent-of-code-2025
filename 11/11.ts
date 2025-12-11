import { memo } from "../utilities";

export function day11a(input: string) {
  const nodes = input.lines().map((line) => {
    const [nodeId, outputsStr] = line.split(":");

    return {
      nodeId,
      outputs: outputsStr.split(" ").filter((x) => x !== ""),
    };
  });

  const countPathsFromNode = memo((nodeId: string): number => {
    if (nodeId === "out") {
      return 1;
    }

    const node = nodes.findOne((x) => x.nodeId === nodeId);
    return node.outputs.map((outputNodeId) => countPathsFromNode(outputNodeId)).sum();
  });

  return countPathsFromNode("you");
}

export function day11b(input: string) {
  const nodes = input.lines().map((line) => {
    const [nodeId, outputsStr] = line.split(":");

    return {
      nodeId,
      outputs: outputsStr.split(" ").filter((x) => x !== ""),
    };
  });

  const countPathsFromNode = memo((nodeId: string, hasVisitedDac: boolean, hasVisitedFft: boolean): number => {
    if (nodeId === "out") {
      if (hasVisitedDac && hasVisitedFft) {
        return 1;
      } else {
        return 0;
      }
    }

    if (nodeId === "dac") {
      hasVisitedDac = true;
    }
    if (nodeId === "fft") {
      hasVisitedFft = true;
    }

    const node = nodes.findOne((x) => x.nodeId === nodeId);
    return node.outputs.map((outputNodeId) => countPathsFromNode(outputNodeId, hasVisitedDac, hasVisitedFft)).sum();
  });

  return countPathsFromNode("svr", false, false);
}
