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
    // [.##.] (1,3) (1) (0,3) (0,1,3) (1,2,3) (3) {23,40,20,64}
    const parts = line.split(" ");

    // it is what it is
    return {
      indicatorLightsObjective: sscanf`[${String}]`(parts[0])[0]
        .chars()
        .map((c: any) => c === "#"),
      buttons: parts.slice(1, parts.length - 1).map((buttonStr) =>
        sscanf`(${String})`(buttonStr)[0]
          .split(",")
          .map((x: string) => x.toInt()),
      ),
      targetJoltage: sscanf`{${String}}`(parts[parts.length - 1])[0]
        .split(",")
        .map((x: string) => x.toInt()),
    };
  });
}

export function day10a(input: string) {
  return parseInput(input)
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

      // BFS with duplicate state detection
      while (true) {
        const fromPosition = lightPositions.shift();
        assert(fromPosition !== undefined);

        // evaluate pressing each button FROM each position
        for (const button of machine.buttons) {
          // press button and compute new indicator lights state
          const currentIndicatorLights = [...fromPosition.currentIndicatorLights];
          for (const light of button) {
            currentIndicatorLights[light] = !fromPosition.currentIndicatorLights[light];
          }

          // check if we've solved it
          if (currentIndicatorLights.every((light, i) => light === machine.indicatorLightsObjective[i])) {
            return fromPosition?.numButtonsPressed + 1;
          }

          // avoid using more presses to land on this path again
          const lightsKey = currentIndicatorLights.join(",");
          if (seenLights.has(lightsKey)) {
            continue;
          }
          seenLights.add(lightsKey);

          lightPositions.push({
            currentIndicatorLights,
            numButtonsPressed: fromPosition.numButtonsPressed + 1,
          });
        }
      }
    })
    .sum();
}

export function day10b(input: string) {
  return parseInput(input)
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

      const solution = solve({
        direction: "minimize" as const,
        objective: "presses",
        constraints,
        variables,
        integers,
      });
      assert(solution.status === "optimal");

      return solution.result;
    })
    .sum();
}
