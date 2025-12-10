import "../utilities";
import { sscanf } from "../utilities";
import assert from "node:assert";

interface Machine {
  indicatorLightsObjective: boolean[];
  currentIndicatorLights: boolean[];
  buttons: number[][];
  targetJoltage: number[];
}

// idea: take the option that gets us closest to the correct solution

// think: this requires a search algo... the buttons 'move' us in space, and we are optimising towards a solution

function buttonPressesForMachine2(machine: Machine): number {
  console.log("starting on", machine);

  const lightPositions: Array<{
    currentIndicatorLights: boolean[];
    numIncorrect: number;
    numButtonsPressed: number;
  }> = [
    {
      currentIndicatorLights: machine.currentIndicatorLights,
      numIncorrect: Infinity,
      numButtonsPressed: 0,
    },
  ];

  const seenLights = new Set<string>();

  while (true) {
    // sort by num buttons pressed (lowest first) then by num incorrect (lowest first)
    lightPositions.sort((a, b) => {
      if (a.numButtonsPressed === b.numButtonsPressed) {
        return a.numIncorrect - b.numIncorrect;
      }

      return a.numButtonsPressed - b.numButtonsPressed;
    });

    const fromPosition = lightPositions.shift();
    // console.log(fromPosition);
    assert(fromPosition !== undefined);

    // evaluate pressing each button FROM each position
    for (const button of machine.buttons) {
      // each button gives us one new position
      const newIndicatorLights = pressButton(fromPosition.currentIndicatorLights, button);
      const numIncorrect2 = numIncorrect(machine.indicatorLightsObjective, newIndicatorLights);

      if (numIncorrect2 === 0) {
        console.log("found solution!", fromPosition.numButtonsPressed + 1);
        return fromPosition.numButtonsPressed + 1;
      }

      const lightsKey = newIndicatorLights.map((x) => (x ? "1" : "0")).join(",");
      if (seenLights.has(lightsKey)) {
        continue;
      }
      seenLights.add(lightsKey);

      lightPositions.push({
        currentIndicatorLights: newIndicatorLights,
        numIncorrect: numIncorrect2,
        numButtonsPressed: fromPosition.numButtonsPressed + 1,
      });
    }
  }
}

function pressButton(currentIndicatorLights: boolean[], button: number[]) {
  const newIndicatorLights = [...currentIndicatorLights];
  for (const light of button) {
    newIndicatorLights[light] = !currentIndicatorLights[light];
  }
  return newIndicatorLights;
}

function numIncorrect(indicatorLightsObjective: boolean[], currentIndicatorLights: boolean[]) {
  let incorrectLights = 0;
  for (let i = 0; i < indicatorLightsObjective.length; i++) {
    if (indicatorLightsObjective[i] !== currentIndicatorLights[i]) {
      incorrectLights++;
    }
  }
  return incorrectLights;
}

export function day10a(input: string) {
  const machines = input.lines().map((line) => {
    const parts = line.split(" ");

    const [indicatorLightsStr] = sscanf`[${String}]`(parts[0]);
    const [joltageStr] = sscanf`{${String}}`(parts[parts.length - 1]);
    const buttonStrs = parts.slice(1, parts.length - 1);
    const buttons = buttonStrs.map((buttonStr) => {
      const [asdf] = sscanf`(${String})`(buttonStr);
      return asdf.split(",").map((x: string) => x.toInt());
    });

    const machine: Machine = {
      indicatorLightsObjective: indicatorLightsStr.chars().map((c) => c === "#"),
      currentIndicatorLights: new Array(indicatorLightsStr.length).fill(false),
      buttons,
      targetJoltage: joltageStr.split(",").map((x: string) => x.toInt()),
    };

    return machine;
  });

  // const asswer = buttonPressesForMachine2({
  //   indicatorLightsObjective: [false, false, false, true, false],
  //   currentIndicatorLights: [false, false, true, true, false],
  //   buttons: [
  //     [0, 2, 3, 4],
  //     [2, 3],
  //     [0, 4],
  //     [0, 1, 2],
  //     [1, 2, 3, 4],
  //   ],
  //   joltage: [7, 5, 12, 7, 2],
  // });
  // console.log(asswer);
  // return 123;

  // console.log(JSON.stringify(machines, null, 2));

  // LCM!

  return machines.map((machine) => buttonPressesForMachine2(machine)).sum();
}

// ----------------------------------------------------------------------

// null means this machine cannot reach target!
function calcJoltageDistance(currentJoltage: number[], targetJoltage: number[]): number | null {
  assert(currentJoltage.length === targetJoltage.length, "currentJoltage and targetJoltage must be same length!");
  let distance = 0;
  for (let i = 0; i < currentJoltage.length; i++) {
    if (currentJoltage[i] > targetJoltage[i]) {
      return null;
    }

    distance += targetJoltage[i] - currentJoltage[i];
  }

  return distance;
}

function calcJoltageDistanceSquared(currentJoltage: number[], targetJoltage: number[]): number | null {
  assert(currentJoltage.length === targetJoltage.length, "currentJoltage and targetJoltage must be same length!");
  let distance = 0;
  for (let i = 0; i < currentJoltage.length; i++) {
    if (currentJoltage[i] > targetJoltage[i]) {
      return null;
    }

    // TODO: is this the opposite of what we want?
    distance += Math.pow(targetJoltage[i] - currentJoltage[i], 2);
  }

  return distance;
}

function applyJoltageForButton(currentJoltage: number[], button: number[]): number[] {
  const newJoltage = [...currentJoltage];
  for (const wire of button) {
    newJoltage[wire] += 1;
  }
  return newJoltage;
}

function buttonPressesForMachinePartB(index: number, machine: Machine): number {
  let closestJoltage = Infinity;
  console.log("Checking machine", machine);
  const joltagePositions: Array<{
    currentJoltage: number[];
    joltageDistance: number; // distance to solution
    numButtonsPressed: number; // distance from start
  }> = [
    {
      currentJoltage: new Array(machine.targetJoltage.length).fill(0),
      joltageDistance: Infinity,
      numButtonsPressed: 0,
    },
  ];

  // TODO: I think we need to keep seen items
  // const seenJoltages = new Set<string>();
  const prevSeenJoltages = new Map<string, number>(); // map to number of turns

  let iterations = 0;
  while (true) {
    // sort by num buttons pressed (lowest first) then by num incorrect (lowest first)
    // console.time("Sort");
    joltagePositions.sort((a, b) => {
      // TODO: omg a+
      // TODO: sort by whatever will get us closest!
      //       isn't that kinda what we're already doing?
      // if (a.numButtonsPressed === b.numButtonsPressed) {
      //   return a.joltageDistance - b.joltageDistance;
      // }
      //
      // return a.numButtonsPressed - b.numButtonsPressed;

      // if (a.joltageDistance === b.joltageDistance) {
      //   return a.numButtonsPressed - b.numButtonsPressed;
      // }
      //
      // return a.joltageDistance - b.joltageDistance;

      // this seems to make no difference to our path...
      // a-star
      const aF = a.joltageDistance + a.numButtonsPressed;
      const bF = b.joltageDistance + b.numButtonsPressed;
      return aF - bF;
    });
    // console.timeEnd("Sort");

    const fromPosition = joltagePositions.shift();
    // console.log(
    //   fromPosition?.numButtonsPressed,
    //   fromPosition?.currentJoltage.join(",") ?? "null",
    //   fromPosition?.joltageDistance ?? "null",
    //   joltagePositions.length,
    // );
    // TODO: sus: why isn't it possible to always lower this? we should be able to sneek forwards at all times
    if (fromPosition?.joltageDistance < closestJoltage) {
      closestJoltage = fromPosition?.joltageDistance ?? Infinity;
    }
    if (iterations % 100_000 === 0) {
      console.log(
        `Machine: ${index} - Buttons: ${fromPosition?.numButtonsPressed} - Distance: ${fromPosition?.joltageDistance} - Paths: ${joltagePositions.length} - Closest: ${closestJoltage}`,
      );
    }
    iterations++;

    assert(fromPosition !== undefined);

    // evaluate pressing each button FROM each position
    for (const button of machine.buttons) {
      // each button gives us one new position
      const newJoltage = applyJoltageForButton(fromPosition.currentJoltage, button);
      const newJoltageDistance = calcJoltageDistance(newJoltage, machine.targetJoltage);
      const newNumButtonsPressed = fromPosition.numButtonsPressed + 1;

      if (newJoltageDistance === null) {
        // console.log(`Went over from ${fromPosition?.joltageDistance}`, {
        //   prevJoltage: fromPosition.currentJoltage,
        //   newJoltage,
        //   prevJoltageDistance: fromPosition.joltageDistance,
        //   newJoltageDistance,
        //   targetJoltage: machine.targetJoltage,
        // });
        continue;
      }

      if (newJoltageDistance === 0) {
        console.log("found solution!", fromPosition.numButtonsPressed + 1);
        return newNumButtonsPressed;
      }

      // TODO: use something other than a set
      const lightsKey = newJoltage.map((x) => x.toString()).join(",");
      const prevVal = prevSeenJoltages.get(lightsKey);
      if (prevVal !== undefined && prevVal < newNumButtonsPressed) {
        continue;
      }
      if (prevVal !== undefined) {
        console.log("Found a better val??");
      }
      prevSeenJoltages.set(lightsKey, fromPosition.numButtonsPressed);

      joltagePositions.push({
        currentJoltage: newJoltage,
        joltageDistance: newJoltageDistance,
        numButtonsPressed: newNumButtonsPressed,
      });
    }
  }
}

export function day10b(input: string) {
  const machines = input.lines().map((line) => {
    const parts = line.split(" ");

    const [indicatorLightsStr] = sscanf`[${String}]`(parts[0]);
    const [joltageStr] = sscanf`{${String}}`(parts[parts.length - 1]);
    const buttonStrs = parts.slice(1, parts.length - 1);
    const buttons = buttonStrs.map((buttonStr) => {
      const [asdf] = sscanf`(${String})`(buttonStr);
      return asdf.split(",").map((x: string) => x.toInt());
    });

    const machine: Machine = {
      indicatorLightsObjective: indicatorLightsStr.chars().map((c) => c === "#"),
      currentIndicatorLights: new Array(indicatorLightsStr.length).fill(false),
      buttons,
      targetJoltage: joltageStr.split(",").map((x: string) => x.toInt()),
    };

    return machine;
  });

  // buttonPressesForMachinePartB(0, machines[0]);
  // buttonPressesForMachinePartB(1, machines[1]); // slow
  buttonPressesForMachinePartB(2, machines[2]); // fast
  buttonPressesForMachinePartB(3, machines[3]); // fast
  buttonPressesForMachinePartB(4, machines[4]); // slow

  return 123;
  // return machines.map((machine, index) => buttonPressesForMachinePartB(index, machine)).sum();
}
