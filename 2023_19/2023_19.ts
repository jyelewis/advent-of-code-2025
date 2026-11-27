import { sscanf } from "../utilities";

export function day2023_19(input: string) {
  const [workflowsStr, partsStr] = input.split("\n\n");

  const workflows = workflowsStr.lines().map((workflowStr) => {
    const [name, rulesetStr] = sscanf`${String}{${String}}`(workflowStr);
    const rules = rulesetStr.split(",").map((ruleStr: string) => {
      const ruleSplit = ruleStr.split(":");
      if (ruleSplit.length === 2) {
        return {
          condition: {
            variable: ruleSplit[0].substring(0, 1),
            operator: ruleSplit[0].substring(1, 2),
            value: ruleSplit[0].substring(2).toInt(),
          },
          next: ruleSplit[1],
        };
      } else {
        return {
          condition: null,
          next: ruleSplit[0],
        };
      }
    });
    return {
      name,
      rules,
    };
  });

  const parts = partsStr.lines().map((partStr) => {
    const [x, m, a, s] = sscanf`{x=${Number},m=${Number},a=${Number},s=${Number}}`(partStr) as number[];
    return { x, m, a, s };
  });

  const evaluateWorkflow = (part: (typeof parts)[0], workflowName: string) => {
    if (workflowName === "R") {
      return "R";
    }
    if (workflowName === "A") {
      return "A";
    }

    const workflow = workflows.findOne((x) => x.name === workflowName);
    for (const rule of workflow.rules) {
      if (rule.condition === null) {
        return evaluateWorkflow(part, rule.next);
      }

      // check condition
      if (rule.condition.operator === ">") {
        if ((part as any)[rule.condition.variable]! > rule.condition.value) {
          return evaluateWorkflow(part, rule.next);
        }
      } else {
        if ((part as any)[rule.condition.variable]! < rule.condition.value) {
          return evaluateWorkflow(part, rule.next);
        }
      }
    }

    throw new Error("No rules matched??");
  };

  const defaultItemState = {
    xMin: 1,
    xMax: 4000,
    mMin: 1,
    mMax: 4000,
    aMin: 1,
    aMax: 4000,
    sMin: 1,
    sMax: 4000,
  };
  type ItemState = typeof defaultItemState;

  const validStatesForWorkflow = (currentState: ItemState, workflowName: string): ItemState[] => {
    if (workflowName === "A") {
      return [currentState];
    }
    if (workflowName === "R") {
      return [];
    }

    const workflow = workflows.findOne((x) => x.name === workflowName);

    let validStates: ItemState[] = [];

    for (const rule of workflow.rules) {
      if (rule.condition === null) {
        validStates = validStates.concat(validStatesForWorkflow(currentState, rule.next));
        continue;
      }

      if (rule.condition.operator === "<") {
        const trueState = { ...currentState } as any;
        trueState[`${rule.condition.variable}Max`] = Math.min(
          trueState[`${rule.condition.variable}Max`],
          rule.condition.value - 1,
        );
        validStates = validStates.concat(validStatesForWorkflow(trueState, rule.next));

        const falseState = { ...currentState } as any;
        falseState[`${rule.condition.variable}Min`] = Math.max(
          falseState[`${rule.condition.variable}Min`],
          rule.condition.value,
        );

        // progress with false state
        currentState = falseState;
      } else if (rule.condition.operator === ">") {
        const trueState = { ...currentState } as any;
        trueState[`${rule.condition.variable}Min`] = Math.max(
          trueState[`${rule.condition.variable}Min`],
          rule.condition.value + 1,
        );
        validStates = validStates.concat(validStatesForWorkflow(trueState, rule.next));

        const falseState = { ...currentState } as any;
        falseState[`${rule.condition.variable}Max`] = Math.min(
          falseState[`${rule.condition.variable}Max`],
          rule.condition.value,
        );

        // progress with false state
        currentState = falseState;
      }
    }

    return validStates;
  };

  const allValidStates = validStatesForWorkflow(defaultItemState, "in");

  // run every workflow and sum the items that pass as for the given parts
  const partA = parts
    .filter((part) => evaluateWorkflow(part, "in") === "A")
    .map((part) => Object.values(part).sum())
    .sum();

  // assuming valid states don't overlap, how many valid combos are there for each?
  const partB = allValidStates
    .map((state) => {
      const numX = state.xMax - state.xMin + 1;
      const numM = state.mMax - state.mMin + 1;
      const numA = state.aMax - state.aMin + 1;
      const numS = state.sMax - state.sMin + 1;
      return numX * numM * numA * numS;
    })
    .sum();

  return { partA, partB };
}
