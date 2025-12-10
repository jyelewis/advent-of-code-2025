import "../utilities";
import { sscanf } from "../utilities";
import { solve } from "yalps";

interface Machine {
  indicatorLightsObjective: boolean[];
  currentIndicatorLights: boolean[];
  buttons: number[][];
  targetJoltage: number[];
}

export function day10a(input: string) {
  return 123;
}

// function buttonPressesForMachinePartB(machine: Machine): number {
//   // create liniar algj functions
//   // coeff matrix (A)
//   // 2a + 1b + 1c
//   // 1a + 3b + 2c
//   // 1a + 0b + 0c
//
//   console.log(machine);
//
//   // TODO: wrong way around?
//   const allCoeffs = machine.targetJoltage.map((_, i) => {
//     const buttonCoeffs = machine.buttons.map((button) => {
//       if (button.includes(i)) {
//         return 1;
//       } else {
//         return 0;
//       }
//     });
//
//     return buttonCoeffs;
//   });
//
//   // const A = [
//   //   [2, 1, 1], // which buttons impact the first segment
//   //   [1, 3, 2], // which buttons impact the first segment
//   //   [1, 0, 0],
//   // ];
//
//   const target = machine.targetJoltage;
//   console.log(allCoeffs, target);
//   const ans = lusolve(allCoeffs, target);
//   console.log(ans);
//
//   return 123;
// }

function buttonPressesForMachinePartB(machine: Machine): number {
  // create liniar algj functions
  // coeff matrix (A)
  // 2a + 1b + 1c
  // 1a + 3b + 2c
  // 1a + 0b + 0c

  // console.log(machine);

  // ------
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
  if (!Number.isInteger(machineSolution.result)) {
    console.log(
      "Non int",
      machine,
      {
        direction: "minimize" as const,
        objective: "presses",
        constraints,
        variables,
        integers,
      },
      machineSolution,
    );
  }
  return machineSolution.result;
  //
  // // TODO: wrong way around?
  // // const allCoeffs = machine.targetJoltage.map((_, i) => {
  // //   const buttonCoeffs = machine.buttons.map((button) => {
  // //     if (button.includes(i)) {
  // //       return 1;
  // //     } else {
  // //       return 0;
  // //     }
  // //   });
  // //
  // //   return buttonCoeffs;
  // // });
  //
  // //  a     b     c       d       e
  // // (1,4) (2,3) (0,2,3) (1,2,3) (0,1,4) {7,22,11,11,15}
  // const solution = solve({
  //   direction: "minimize" as const,
  //   objective: "presses",
  //   constraints: {
  //     // wood: { max: 300 },
  //     // labor: { max: 110 }, // labor should be <= 110
  //     // storage: lessEq(400), // you can use the helper functions instead
  //     counter0: { equal: 7 },
  //     counter1: { equal: 22 },
  //     counter2: { equal: 11 },
  //     counter3: { equal: 11 },
  //     counter4: { equal: 15 },
  //   },
  //   variables: {
  //     buttonA: { presses: 1, counter1: 1, counter4: 1 },
  //     buttonB: { presses: 1, counter2: 1, counter3: 1 },
  //     buttonC: { presses: 1, counter0: 1, counter2: 1, counter3: 1 },
  //     buttonD: { presses: 1, counter1: 1, counter2: 1, counter3: 1 },
  //     buttonE: { presses: 1, counter0: 1, counter1: 1, counter4: 1 },
  //   },
  //   integers: ["counter0", "counter1", "counter2", "counter3", "counter4", "presses"],
  // });
  // console.log(solution);

  return 123;
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
      indicatorLightsObjective: indicatorLightsStr.chars().map((c: any) => c === "#"),
      currentIndicatorLights: new Array(indicatorLightsStr.length).fill(false),
      buttons,
      targetJoltage: joltageStr.split(",").map((x: string) => x.toInt()),
    };

    // console.log(buttons.length, machine.targetJoltage.length);

    return machine;
  });

  // buttonPressesForMachinePartB(machines[0]);
  // buttonPressesForMachinePartB(1, machines[1]); // slow
  // buttonPressesForMachinePartB(2, machines[2]); // fast
  // buttonPressesForMachinePartB(3, machines[3]); // fast
  // buttonPressesForMachinePartB(4, machines[4]); // slow

  // return 123;
  return machines.map((machine, index) => buttonPressesForMachinePartB(machine)).sum();
}
