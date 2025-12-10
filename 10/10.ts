import "../utilities";
import { sscanf } from "../utilities";
import assert from "node:assert";

interface Machine {
  indicatorLightsObjective: boolean[];
  currentIndicatorLights: boolean[];
  buttons: number[][];
  joltage: number[];
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
      joltage: joltageStr.split(",").map((x: string) => x.toInt()),
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

export function day10b(input: string) {
  return 123;
}
