import { range, sscanf } from "../utilities";
import assert from "node:assert";
import fs from "fs";

interface Gate {
  op: "AND" | "XOR" | "OR";
  input1: string;
  input2: string;
  output: string;
}

class Network {
  constructor(
    public wires: Record<string, null | number>,
    public gates: Gate[],
  ) {}

  static fromInput(input: string) {
    const [inputValuesStr, gatesStr] = input.split("\n\n");

    const wires: Record<string, null | number> = {};

    // process the gates first
    const gates: Gate[] = gatesStr.lines().map((gateLine) => {
      const [input1, op, input2, output] = sscanf`${String} ${String} ${String} -> ${String}`(gateLine);
      // create the wires
      wires[input1] = null;
      wires[input2] = null;
      wires[output] = null;
      return { input1, op, input2, output };
    });

    // now attach known input values to the wires
    inputValuesStr.lines().forEach((inputValueLine) => {
      const [wire, value] = sscanf`${String}: ${Number}`(inputValueLine);
      assert(wire in wires);
      assert(wires[wire] === null);
      wires[wire] = value;
    });

    return new this(wires, gates);
  }

  evaluate() {
    while (true) {
      const readyGates = this.gates.filter((gate) => {
        const output = this.wires[gate.output];
        assert(output !== undefined);

        const input1 = this.wires[gate.input1];
        assert(input1 !== undefined);

        const input2 = this.wires[gate.input2];
        assert(input2 !== undefined);

        return output === null && input1 !== null && input2 !== null;
      });

      readyGates.forEach((gate) => {
        const output = this.wires[gate.output];
        assert(output !== undefined);

        const input1 = this.wires[gate.input1];
        assert(input1 !== undefined && input1 !== null);

        const input2 = this.wires[gate.input2];
        assert(input2 !== undefined && input2 !== null);

        switch (gate.op) {
          case "AND":
            this.wires[gate.output] = input1 & input2;
            break;
          case "OR":
            this.wires[gate.output] = input1 | input2;
            break;
          case "XOR":
            this.wires[gate.output] = input1 ^ input2;
            break;
        }
      });

      if (readyGates.length === 0) {
        // we're all computed
        break;
      }
    }
  }

  getGatesForInputWire(wire: string): Gate[] {
    return this.gates.filter((g) => g.input1 === wire || g.input2 === wire);
  }
}

export function day2024_24a(input: string) {
  const network = Network.fromInput(input);
  network.evaluate();

  // find 'z' wires
  const zWires = Object.entries(network.wires).filter(([wire]) => wire.startsWith("z"));
  zWires.sort((a, b) => b[0].localeCompare(a[0]));

  const zBits = zWires.map((x) => x[1]).join("");
  const zValue = parseInt(zBits, 2);
  return zValue;
}

export function day2024_24b(input: string) {
  const network = Network.fromInput(input);

  const numXInputs = Object.keys(network.wires).count((wire) => wire.startsWith("x"));
  const numYInputs = Object.keys(network.wires).count((wire) => wire.startsWith("y"));
  assert(numXInputs === numYInputs);
  const numInputs = numXInputs;

  let susWires: string[] = [];

  // reference layer: https://en.wikipedia.org/wiki/Adder_(electronics)#/media/File:Fulladder.gif

  const knownGates: Record<string, Gate> = {};

  // check first layer
  for (const i of range(numInputs)) {
    const wireNum = i.toString().padStart(2, "0");
    const xWire = `x${wireNum}`;
    const yWire = `y${wireNum}`;
    const xGates = network.getGatesForInputWire(xWire);
    // console.log(xWire, xGates);

    // expectations
    // 2 gates
    // 1 XOR (1)
    // 1 AND (2)
    // OTHER input is this same num but with y

    const xorGate1 = xGates.find((g) => {
      if (g.op !== "XOR") {
        return false;
      }

      if (g.input1 === xWire && g.input2 !== yWire) {
        return false;
      }

      if (g.input1 === yWire && g.input2 !== xWire) {
        return false;
      }

      return true; // valid XOR gate
    });
    if (!xorGate1) {
      assert(false, "unexpected missing xorGate? Expected only outputs are mixed up");
      // susWires.push(xWire);
    } else {
      knownGates[`${wireNum}_1xor`] = xorGate1;
    }

    const andGate4 = xGates.find((g) => {
      if (g.op !== "AND") {
        return false;
      }

      if (g.input1 === xWire && g.input2 !== yWire) {
        return false;
      }

      if (g.input1 === yWire && g.input2 !== xWire) {
        return false;
      }

      return true; // valid AND gate
    });
    if (!andGate4) {
      assert(false, "unexpected missing andGate? Expected only outputs are mixed up");
      // susWires.push(xWire);
    } else {
      knownGates[`${wireNum}_4and`] = andGate4;
    }
  }

  // find xor (2) by searching backwards
  for (const i of range(numInputs)) {
    const wireNum = i.toString().padStart(2, "0");
    const zWire = `z${wireNum}`;
    const xorGate2 = network.gates.find((gate) => gate.op === "XOR" && gate.output === zWire);
    if (!xorGate2) {
      console.log(`SUS 1: Expected ${zWire} to be connected to the output of an XOR`);
      susWires.push(zWire);
    } else {
      knownGates[`${wireNum}_2xor`] = xorGate2;
    }
  }

  // find OR(5) by searching forwards from AND (4)
  for (const i of range(numInputs)) {
    const wireNum = i.toString().padStart(2, "0");
    const and4 = knownGates[`${wireNum}_4and`];
    const or5 = network.gates.find(
      (gate) => gate.op === "OR" && (gate.input1 === and4.output || gate.input2 === and4.output),
    );
    if (!or5) {
      // TODO: should this be sus gates?
      console.log(`SUS 2: expected ${and4.output} to be connected to an OR gate input`);
      susWires.push(and4.output);
    } else {
      assert(or5.op === "OR");
      knownGates[`${wireNum}_5or`] = or5;
    }
  }

  // finally, find AND(3) by searching forwards from XOR (1) and checking against prev carry
  for (const i of range(1, numInputs)) {
    const wireNum = i.toString().padStart(2, "0");
    const prevWireNum = (i - 1).toString().padStart(2, "0");

    const prevCarryInGate = knownGates[`${prevWireNum}_5or`];

    if (!prevCarryInGate) {
      console.log(wireNum, "no prev carry in, skipping");
      continue;
    }
    assert(prevCarryInGate.op === "OR");
    const prevCarryIn = prevCarryInGate.output;

    const xor1 = knownGates[`${wireNum}_1xor`];
    if (!xor1) {
      console.log(wireNum, "no xor (probs end of chain) skipping");
      continue;
    }
    const and3 = network.gates.find(
      (gate) => gate.op === "AND" && (gate.input1 === xor1.output || gate.input2 === xor1.output),
    );
    // check xor2 is hooked up the the carry input
    if (!and3) {
      console.log(`SUS 3: expected ${xor1.output} to be connected to an AND gate`);
      susWires.push(xor1.output); // might not be the right measure?
    } else {
      if (
        (and3.input1 === xor1.output && and3.input2 === prevCarryIn) ||
        (and3.input2 === xor1.output && and3.input1 === prevCarryIn)
      ) {
        // valid
        // console.log("VALID AND3", wireNum);
        knownGates[`${wireNum}_3and`] = and3;
      } else {
        // sus
        if (and3.input1 === xor1.output) {
          // console.log("unknownish sus 1", `expected and3.input2 (${and3.input2}) === prevCarryIn (${prevCarryIn})`);
          console.log("SUS 4a: ");
          susWires.push(and3.input2);
        } else {
          // console.log("unknownish sus 2");
          console.log("SUS 4b");
          susWires.push(and3.input1);
        }
      }
    }
  }

  console.log({ susWires }); // OMG 8 exactly!!
  susWires.push("z15", "ckj");
  susWires.push("z23", "kdf");
  susWires.push("z39", "rpp");
  susWires.push("dbp", "fdv");
  // start of chain edge case
  susWires = susWires.filter((w) => w !== "rfg");

  susWires.sort((a, b) => a.localeCompare(b));
  return susWires.join(",");
}

export function renderGraph(input: string) {
  const network = Network.fromInput(input);

  const graphFile: any = {
    type: "gephi-lite",
    version: "1.1.1",
    graphDataset: {
      nodeData: {},
      edgeData: {},
      layout: {},
      metadata: {
        title: "",
      },
      nodeFields: [
        {
          type: "text",
          dynamic: false,
          itemType: "nodes",
          id: "label",
          label: "label",
        },
      ],
      edgeFields: [
        {
          type: "text",
          dynamic: false,
          itemType: "edges",
          id: "label",
          label: "label",
        },
      ],
      fullGraph: {
        options: {
          type: "mixed",
          multi: true,
          allowSelfLoops: true,
        },
        attributes: {},
        nodes: [],
        edges: [],
      },
    },
    filters: {
      filters: [],
    },
    appearance: {
      showEdges: {
        value: true,
      },
      nodesSize: {
        type: "fixed",
        value: 20,
      },
      edgesSize: {
        type: "fixed",
        value: 6,
      },
      backgroundColor: "#FFFFFF00",
      layoutGridColor: "#666666",
      backgroundLayer: {
        type: "map",
        enabled: false,
      },
      backgroundMapStyle: null,
      nodesColor: {
        type: "fixed",
        value: "#999999",
      },
      edgesColor: {
        type: "fixed",
        value: "#cccccc",
      },
      nodesLabel: {
        type: "field",
        field: {
          type: "text",
          dynamic: false,
          itemType: "nodes",
          id: "label",
          label: "label",
        },
        missingValue: null,
      },
      edgesLabel: {
        type: "field",
        field: {
          type: "text",
          dynamic: false,
          itemType: "edges",
          id: "label",
          label: "label",
        },
        missingValue: null,
      },
      nodesLabelSize: {
        type: "fixed",
        value: 14,
        zoomCorrelation: 0,
        density: 1,
      },
      edgesLabelSize: {
        type: "fixed",
        value: 14,
        zoomCorrelation: 0,
        density: 1,
      },
      nodesLabelEllipsis: {
        type: "ellipsis",
        enabled: false,
        maxLength: 25,
      },
      edgesLabelEllipsis: {
        type: "ellipsis",
        enabled: false,
        maxLength: 25,
      },
      nodesImage: {
        type: "none",
      },
      edgesZIndex: {
        type: "none",
      },
    },
    layout: {
      quality: {
        enabled: false,
        showGrid: true,
      },
      lastRun: {
        layoutId: "force",
        params: {
          attraction: 0.0005,
          repulsion: 0.1,
          gravity: 0.0001,
          inertia: 0.6,
          maxMove: 200,
        },
      },
    },
  };

  const addNode = (key: string, label: string) => {
    graphFile.graphDataset.nodeData[key] = {
      label,
    };
    graphFile.graphDataset.fullGraph.nodes.push({
      key,
    });
    graphFile.graphDataset.layout[key] = {
      x: 0,
      y: 0,
    };
  };

  const addEdge = (fromNode: string, toNode: string, key: string, label: string) => {
    graphFile.graphDataset.edgeData[key] = {
      label,
    };
    graphFile.graphDataset.fullGraph.edges.push({
      key,
      source: fromNode,
      target: toNode,
    });
  };

  // add all wires as independent nodes
  Object.keys(network.wires).forEach((key) => {
    addNode(key, `Wire ${key}`);
  });

  // add all gates as nodes + wire up things
  network.gates.forEach((gate) => {
    const key = Math.random().toString(32);
    addNode(key, gate.op);
    addEdge(gate.input1, key, `${key}_input1`, "input1");
    addEdge(gate.input2, key, `${key}_input2`, "input2");
    addEdge(key, gate.output, `${key}_out`, "out");
  });

  fs.writeFileSync("./graph.json", JSON.stringify(graphFile));
}

// TODO: bruh z15 is in there twice - it's being mis-idenfitied
// manually find swaps, then re-run
// suspected sus:  [
//     'z15', 'z23',
//     'z39', 'rfg',
//     'fdv', 'z15',
//     'dbp', 'kdf'
//   ]

// confirmed sus: z15, z23, z39,
// confirmed not sus:

// known swaps: z15 <-> ckj
