import { lcm, range } from "../utilities";
import assert from "node:assert";

export function day2023_20a(input: string) {
  const modules = input.lines().map((line) => {
    const [moduleStr, outputsStr] = line.split(" -> ");
    let type = "broadcaster";
    let name = moduleStr;
    let state: any = {};
    if (moduleStr.startsWith("%")) {
      type = "flip-flop";
      name = moduleStr.substring(1);
      state = { on: false };
    } else if (moduleStr.startsWith("&")) {
      type = "conjunction";
      name = moduleStr.substring(1);
      state = { inputs: {} };
    } else if (moduleStr === "broadcaster") {
      type = "broadcaster";
    } else {
      throw new Error("Invalid type");
    }

    return {
      type,
      name,
      outputs: outputsStr.split(",").map((x) => x.trim()),
      state,
    };
  });

  // pre-fill conjunction inputs state
  modules.forEach((sendingModule) => {
    sendingModule.outputs.forEach((receivingModuleName) => {
      const receivingModule = modules.find((x) => x.name === receivingModuleName);
      if (receivingModule !== undefined && receivingModule.type === "conjunction") {
        receivingModule.state.inputs[sendingModule.name] = "low";
      }
    });
  });

  const moduleIdx: Record<string, (typeof modules)[0]> = {};
  modules.forEach((m) => (moduleIdx[m.name] = m));

  let totalLowPulsesSent = 0;
  let totalHighPulsesSent = 0;

  const pulseQueue: Array<{ fromModuleName: string; toModuleName: string; pulse: "high" | "low" }> = [];

  const sendOutputPulse = (module: (typeof modules)[0], pulse: "high" | "low") => {
    module.outputs.forEach((output) => {
      if (pulse === "low") {
        totalLowPulsesSent++;
      } else {
        totalHighPulsesSent++;
      }

      pulseQueue.push({
        fromModuleName: module.name,
        toModuleName: output,
        pulse,
      });
    });
  };

  const handlePulse = (fromModuleName: string, toModuleName: string, pulse: "high" | "low") => {
    // const module = modules.find((x) => x.name === toModuleName);
    const module = moduleIdx[toModuleName];
    if (module === undefined) {
      console.warn(`Missing modules ${toModuleName}... skipping`);
      return;
    }

    switch (module.type) {
      case "broadcaster": {
        sendOutputPulse(module, pulse);
        break;
      }
      case "flip-flop": {
        if (pulse === "low") {
          if (module.state.on) {
            // If it was on, it turns off and sends a low pulse
            module.state.on = false;
            sendOutputPulse(module, "low");
          } else {
            // If it was off, it turns on and sends a high pulse
            module.state.on = true;
            sendOutputPulse(module, "high");
          }
        }
        break;
      }
      case "conjunction": {
        // When a pulse is received, the conjunction module first updates its memory for that input
        module.state.inputs[fromModuleName] = pulse;

        // Then, if it remembers high pulses for all inputs, it sends a low pulse;
        if (Object.values(module.state.inputs).every((x) => x === "high")) {
          sendOutputPulse(module, "low");
        } else {
          // otherwise, it sends a high pulse.
          sendOutputPulse(module, "high");
        }
        break;
      }
      default: {
        throw new Error(module.type);
      }
    }
  };

  const pushButton = () => {
    assert(pulseQueue.length === 0);
    totalLowPulsesSent++;
    pulseQueue.push({
      fromModuleName: "human",
      toModuleName: "broadcaster",
      pulse: "low",
    });

    while (pulseQueue.length) {
      const nextPulse = pulseQueue.shift();
      // console.log(nextPulse);
      assert(nextPulse);
      handlePulse(nextPulse.fromModuleName, nextPulse.toModuleName, nextPulse.pulse);
    }
  };

  for (const i of range(1000)) {
    pushButton();
  }

  // console.log({ totalLowPulsesSent, totalHighPulsesSent });

  return totalLowPulsesSent * totalHighPulsesSent;
}

export function day2023_20b(input: string) {
  const modules = input.lines().map((line) => {
    const [moduleStr, outputsStr] = line.split(" -> ");
    let type = "broadcaster";
    let name = moduleStr;
    let state: any = {};
    if (moduleStr.startsWith("%")) {
      type = "flip-flop";
      name = moduleStr.substring(1);
      state = { on: false };
    } else if (moduleStr.startsWith("&")) {
      type = "conjunction";
      name = moduleStr.substring(1);
      state = { inputs: {} };
    } else if (moduleStr === "broadcaster") {
      type = "broadcaster";
    } else {
      throw new Error("Invalid type");
    }

    return {
      type,
      name,
      outputs: outputsStr.split(",").map((x) => x.trim()),
      state,
      linkedOutputs: [] as any,
    };
  });

  // pre-fill conjunction inputs state
  modules.forEach((sendingModule) => {
    sendingModule.outputs.forEach((receivingModuleName) => {
      const receivingModule = modules.find((x) => x.name === receivingModuleName);
      if (receivingModule !== undefined && receivingModule.type === "conjunction") {
        receivingModule.state.inputs[sendingModule.name] = "low";
      }

      if (receivingModule !== undefined) {
        sendingModule.linkedOutputs.push(receivingModule);
      }
    });
  });

  const pulseQueue: Array<{ fromModuleName: string; toModule: any; pulse: "high" | "low" }> = [];

  let lastSeen: any = {};
  let mgCycles: any = {};

  const sendOutputPulse = (module: (typeof modules)[0], pulse: "high" | "low") => {
    module.linkedOutputs.forEach((output: any) => {
      if (output.name === "mg" && pulse === "high") {
        if (lastSeen[module.name]) {
          mgCycles[module.name] = buttonPresses - lastSeen[module.name];
        }

        lastSeen[module.name] = buttonPresses;
      }

      pulseQueue.push({
        fromModuleName: module.name,
        toModule: output,
        pulse,
      });
    });
  };

  const handlePulse = (fromModuleName: string, toModule: any, pulse: "high" | "low") => {
    const module = toModule;

    switch (module.type) {
      case "broadcaster": {
        sendOutputPulse(module, pulse);
        break;
      }
      case "flip-flop": {
        if (pulse === "low") {
          if (module.state.on) {
            // If it was on, it turns off and sends a low pulse
            module.state.on = false;
            sendOutputPulse(module, "low");
          } else {
            // If it was off, it turns on and sends a high pulse
            module.state.on = true;
            sendOutputPulse(module, "high");
          }
        }
        break;
      }
      case "conjunction": {
        // When a pulse is received, the conjunction module first updates its memory for that input
        module.state.inputs[fromModuleName] = pulse;

        // Then, if it remembers high pulses for all inputs, it sends a low pulse;
        if (Object.values(module.state.inputs).every((x) => x === "high")) {
          sendOutputPulse(module, "low");
        } else {
          // otherwise, it sends a high pulse.
          sendOutputPulse(module, "high");
        }
        break;
      }
      default: {
        throw new Error(module.type);
      }
    }
  };

  const broadcaster = modules.findOne((x) => x.name === "broadcaster");
  const pushButton = () => {
    assert(pulseQueue.length === 0);
    pulseQueue.push({
      fromModuleName: "human",
      toModule: broadcaster,
      pulse: "low",
    });

    while (pulseQueue.length) {
      const nextPulse = pulseQueue.shift();
      assert(nextPulse);
      handlePulse(nextPulse.fromModuleName, nextPulse.toModule, nextPulse.pulse);
    }
  };

  let buttonPresses = 0;
  while (buttonPresses < 20000) {
    pushButton();
    buttonPresses++;
  }

  return lcm(Object.values(mgCycles));
}
