import { sscanf } from "../utilities";
import { solve } from "yalps";
import assert from "node:assert";

interface Machine {
  indicatorLightsObjective: boolean[];
  buttons: number[][];
  targetJoltage: number[];
}

function parseInput(input: string): Machine[] {
  return input.lines().map((line) => {
    const parts = line.split(" ");

    const [indicatorLightsStr] = sscanf`[${String}]`(parts[0]);
    const [joltageStr] = sscanf`{${String}}`(parts[parts.length - 1]);
    const buttonStrs = parts.slice(1, parts.length - 1);
    const buttons = buttonStrs.map((buttonStr) => {
      const [buttonWires] = sscanf`(${String})`(buttonStr);
      return buttonWires.split(",").map((x: string) => x.toInt());
    });

    return {
      indicatorLightsObjective: indicatorLightsStr.chars().map((c: any) => c === "#"),
      buttons,
      targetJoltage: joltageStr.split(",").map((x: string) => x.toInt()),
    };
  });
}

export function day10a(input: string) {
  const machines = parseInput(input);

  return machines
    .map((machine) => {
      const lightPositions: Array<{
        currentIndicatorLights: boolean[];
        numButtonsPressed: number;
      }> = [
        {
          currentIndicatorLights: new Array(machine.indicatorLightsObjective.length).fill(false),
          numButtonsPressed: 0,
        },
      ];

      const seenLights = new Set<string>();

      while (true) {
        const fromPosition = lightPositions.shift();
        assert(fromPosition !== undefined);

        // evaluate pressing each button FROM each position
        for (const button of machine.buttons) {
          // press button and compute new indicator lights state
          const newIndicatorLights = [...fromPosition.currentIndicatorLights];
          for (const light of button) {
            newIndicatorLights[light] = !fromPosition.currentIndicatorLights[light];
          }

          // check if we've solved it
          if (newIndicatorLights.every((light, i) => light === machine.indicatorLightsObjective[i])) {
            return fromPosition?.numButtonsPressed + 1;
          }

          // avoid using more presses to land on this path again
          const lightsKey = newIndicatorLights.map((x) => (x ? "1" : "0")).join(",");
          if (seenLights.has(lightsKey)) {
            continue;
          }
          seenLights.add(lightsKey);

          lightPositions.push({
            currentIndicatorLights: newIndicatorLights,
            numButtonsPressed: fromPosition.numButtonsPressed + 1,
          });
        }
      }
    })
    .sum();
}

export function day10b(input: string) {
  const machines = parseInput(input);
  return machines
    .map((machine) => {
      const integers: string[] = ["presses"];
      const constraints: any = {};
      for (const [joltageIndex, joltageValue] of machine.targetJoltage.entries()) {
        constraints[`joltage${joltageIndex}`] = { equal: joltageValue };
        integers.push(`joltage${joltageIndex}`);
      }

      const variables: any = {};
      for (const [buttonIndex, button] of machine.buttons.entries()) {
        var va: any = { presses: 1 };
        for (const buttonJoltageIndex of button) {
          va[`joltage${buttonJoltageIndex}`] = 1;
        }

        variables[`button${buttonIndex}`] = va;
        integers.push(`button${buttonIndex}`);
      }
      // ------
      const machineSolution = solve({
        direction: "minimize" as const,
        objective: "presses",
        constraints,
        variables,
        integers,
      });

      return machineSolution.result;
    })
    .sum();
}
