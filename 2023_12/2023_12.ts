import "../utilities";
import assert from "node:assert";
import { memo, range } from "../utilities";
import fs from "fs";

// TODO: approach here must be fundamentally wrong, come back to this with fresh eyes

interface ConditionReport {
  path: string[];
  plan: number[];
}

class StringEater {
  constructor(
    public readonly str: string,
    public cursor: number = 0,
  ) {}

  clone(): StringEater {
    return new StringEater(this.str, this.cursor);
  }

  get char(): string {
    return this.str[this.cursor];
  }

  public eatUntil(atChar: string) {
    assert(atChar.length === 1);
    while (this.char !== atChar && !this.EOL) {
      this.eatOne();
    }
  }

  public eatUntilEither(atChars: string[]) {
    assert(atChars.every((x) => x.length === 1));
    while (atChars.indexOf(this.char) === -1 && !this.EOL) {
      this.eatOne();
    }
  }

  public eatStr(eatStr: string) {
    // assert(eatChar === this.char, "not at expected char");

    // TODO: do we even need this?
    // check we have n chars ready to go
    const end = this.cursor + eatStr.length;
    if (end > this.str.length) {
      return false;
    }

    const canEat = this.str.substring(this.cursor, end) === eatStr;

    if (canEat) {
      this.cursor += eatStr.length;
      return true;
    } else {
      return false;
    }
  }

  public get EOL() {
    return this.cursor === this.str.length;
  }

  public eatOne() {
    assert(!this.EOL);
    this.cursor++;
  }
}

// function isComplete(cr: ConditionReport): boolean {
//   return cr.path.every((c) => c !== "?");
// }

function isValid(cr: ConditionReport): boolean {
  const se = new StringEater(cr.path.join(""));

  for (const expectedDamaged of cr.plan) {
    se.eatUntil("#");

    const didEat = se.eatStr(`${"#".repeat(expectedDamaged)}.`);
    if (didEat) {
      continue;
    } else {
      // console.log("Not valid, could not eat");
      return false;
    }
  }

  // console.log(`Valid ${cr.path.join("")}`);
  se.eatUntil("#");
  if (!se.EOL) {
    return false;
  }
  return true;
}

const isValid2RegexForCr = memo((crPlan: number[]) => {
  const regexParts = [];

  // lock to start
  regexParts.push("^");

  // can optionally start with dots
  regexParts.push("[.]*");

  for (const expectedHashes of crPlan) {
    regexParts.push(`[#]{${expectedHashes}}[.]+`);
  }

  // lock to end
  regexParts.push("$");

  const regex = new RegExp(regexParts.join(""));

  return regex;
});

function isValid2(cr: ConditionReport): boolean {
  const regex = isValid2RegexForCr(cr.plan);
  return cr.path.join("").match(regex) !== null;
}

let stats = {
  couldBeValidTrue: 0,
  optim1: 0,
  couldBeValidFalse2: 0,
  couldBeValidFalse3: 0,
};

// export function couldBeValid(cr: ConditionReport): boolean {
//   let se = new StringEater(cr.path.join(""));
//
//   for (const expectedDamaged of cr.plan) {
//     // console.log(11111, { expectedDamaged });
//     // jump over dots
//     se.eatUntilEither(["#", "?"]);
//
//     let outerMatched = false;
//     for (const startOffset of range(0, cr.path.length - se.cursor - 1)) {
//       const trialSe = se.clone();
//       trialSe.cursor = trialSe.cursor + startOffset;
//
//       // ok another theory, every element that we're jumping over MUST be a '.' or a '?'
//       const offsetStr = se.str.substring(se.cursor, trialSe.cursor);
//       // console.log(22222, { startOffset, offsetStr, "trialSe.cursor": trialSe.cursor });
//       if (offsetStr.includes("#")) {
//         // TODO: ugh this example does actually break this trick, we need to walk backwards: '??#?.???## 1,4'
//         // ok so this now breaks part a.... but only by a bit no idea which items are tripped up by the change
//         // console.log(`offsetStr trick, ${offsetStr}`);
//         // return false;
//       }
//
//       if (trialSe.char === ".") {
//         // console.log("OPTIMISATION", startOffset, trialSe.cursor, se.cursor);
//         stats.optim1++;
//         // return false;
//         continue;
//       }
//
//       let matched = true;
//       for (const i of range(expectedDamaged)) {
//         // look for n '#' or '?'
//         // console.log(33333, trialSe.char);
//         if (trialSe.char === "#" || trialSe.char === "?") {
//           trialSe.eatOne();
//         } else {
//           // look further down the chain instead...
//           // console.log("Cannot match... breaking to look with an offset");
//           matched = false;
//           break;
//         }
//       }
//
//       if (!matched) {
//         // try next startOffset
//         continue;
//       } else {
//         // console.log("Matched!");
//         // ok, so this doesn't work becuase we may need to treat a ? as a . (i.e. `?#?#?#?#?#?#?#? 1,3,1,6`, first ? must be '.')
//         // ok we did match, now we MUST see either a '.' or a '?' to ensure we do have a break after the solid thing
//         // if (trialSe.char === "." || trialSe.char === "?") {
//         se = trialSe;
//         outerMatched = true;
//         break;
//         // } else {
//         // TODO: this breaks things, I'm not sure why though...
//         // we have TOO many hashes to match this, the code MUST NOt be valid
//         // return false;
//         // }
//
//         // hm, didn't end.. this must not be valid?
//         // TODO: unchecked
//         // return false;
//         // break;
//       }
//     }
//
//     if (!outerMatched) {
//       // couldn't match at all
//       stats.couldBeValidFalse2++;
//       return false;
//     }
//     // we've eaten all expectedDamaged, consume a dot
//     se.eatUntilEither([".", "?"]);
//
//     // TODO: is this even used???
//     // TODO: suspected optimisation here....
//     if (se.EOL) {
//       // dunno probs not possible then
//       // return true; // idk
//       stats.couldBeValidFalse3++;
//       return false;
//     }
//     se.eatOne();
//   }
//
//   // we can get all the expected damage somehow, this path must be valid
//   stats.couldBeValidTrue++;
//   return true;
// }

const couldBeValid2RegexForCr = memo((crPlan: number[]) => {
  const regexParts = [];

  // lock to start
  regexParts.push("^");

  // can optionally start with dots
  regexParts.push("[.?]*");

  for (const expectedHashes of crPlan) {
    regexParts.push(`[#?]{${expectedHashes}}[.?]+`);
  }

  // lock to end
  regexParts.push("$");

  const regex = new RegExp(regexParts.join(""));

  return regex;
});

export function couldBeValid2(cr: ConditionReport): boolean {
  const regex = couldBeValid2RegexForCr(cr.plan);

  const match = cr.path.join("").match(regex);
  return match !== null;
}

export function day2023_12a(input: string) {
  const conditionReports: ConditionReport[] = input.lines().map((line) => {
    const [pathStr, planStr] = line.split(" ");
    const path = pathStr.chars();
    path.push("."); // extra blank so we can always match a dot after
    const plan = planStr.split(",").map((x) => x.toInt());
    return { path, plan };
  });

  const countSolutionsToCR = (cr: ConditionReport): number => {
    const crIndex = cr.path.indexOf("?");

    if (crIndex === -1) {
      // console.time("isValid");
      if (isValid(cr)) {
        // console.timeEnd("isValid");
        return 1;
      } else {
        // console.timeEnd("isValid");
        return 0;
      }

      // full solution! Check if valid
      // TODO: check fr
      // return 1;
    }

    // check this path COULD be valid
    // console.time("couldBeValid");
    if (!couldBeValid2(cr)) {
      // console.timeEnd("couldBeValid");
      return 0;
    }
    // console.timeEnd("couldBeValid");

    // check solutions for each index going each way
    const crAPath = [...cr.path];
    crAPath[crIndex] = "#";
    const crA = {
      path: crAPath,
      plan: cr.plan,
    };

    const crBPath = [...cr.path];
    crBPath[crIndex] = ".";
    const crB = {
      path: crBPath,
      plan: cr.plan,
    };

    const countA = countSolutionsToCR(crA);
    const countB = countSolutionsToCR(crB);

    // if (countA === 0 && countB === 0) {
    //   console.log("not flagged....", cr.path.join(""));
    // }

    return countA + countB;
  };

  // const testConditionReport = conditionReports[4];
  // console.log({ testConditionReport, count: countSolutionsToCR(testConditionReport) });
  // return countSolutionsToCR(testConditionReport);

  for (const cr of conditionReports) {
    // console.log(555);
    const count = countSolutionsToCR(cr);
    console.log(`${cr.path.join("")}: ${count}`);
  }

  return conditionReports.map((cr) => countSolutionsToCR(cr)).sum();
}

export function day2023_12b(input: string) {
  // expand the input, then call part1
  const conditionReports: ConditionReport[] = input.lines().map((line) => {
    const [pathStr, planStr] = line.split(" ");
    const path = pathStr.chars();
    const expandedPath = [...path, "?", ...path, "?", ...path, "?", ...path, "?", ...path, "."];
    // path.push("."); // extra blank so we can always match a dot after
    const plan = planStr.split(",").map((x) => x.toInt());
    const expandedPlan = [...plan, ...plan, ...plan, ...plan, ...plan];
    return { path: expandedPath, plan: expandedPlan };
  });

  const countSolutionsToCR = (cr: ConditionReport): number => {
    const crIndex = cr.path.indexOf("?");

    if (crIndex === -1) {
      // console.time("isValid");
      if (isValid2(cr)) {
        // console.timeEnd("isValid");
        return 1;
      } else {
        // console.timeEnd("isValid");
        return 0;
      }
    }

    // check this path COULD be valid
    // console.time("couldBeValid");
    if (!couldBeValid2(cr)) {
      // console.timeEnd("couldBeValid");
      return 0;
    }
    // console.timeEnd("couldBeValid");

    // check solutions for each index going each way
    const crAPath = [...cr.path];
    crAPath[crIndex] = "#";
    const crA = {
      path: crAPath,
      plan: cr.plan,
    };

    const crBPath = [...cr.path];
    crBPath[crIndex] = ".";
    const crB = {
      path: crBPath,
      plan: cr.plan,
    };

    const countA = countSolutionsToCR(crA);
    const countB = countSolutionsToCR(crB);

    if (countA === 0 && countB === 0) {
      const regex = couldBeValid2RegexForCr(cr.plan);
      console.log("not flagged:", cr.path.join(""), cr.plan, regex);
      throw new Error("missed flag");
    }

    return countA + countB;
  };

  // const testConditionReport = conditionReports[1];
  // console.log({ testConditionReport, count: countSolutionsToCR(testConditionReport), stats });
  // return 123;
  // const count = countSolutionsToCR(testConditionReport);

  // return conditionReports.map((cr) => countSolutionsToCR(cr)).sum();
  let sum = 0;
  let i = 1;
  for (const cr of conditionReports) {
    console.time(`countSolutionsToCR ${i}`);
    const count = countSolutionsToCR(cr);
    console.timeEnd(`countSolutionsToCR ${i}`);
    sum += count;
    console.log(`${i}: ${cr.path.join("")}: ${count}`);
    i++;
  }

  return sum;
}

export function day2023_12b_mutations(input: string) {
  // expand the input, then call part1
  const conditionReports: ConditionReport[] = input.lines().map((line) => {
    const [pathStr, planStr] = line.split(" ");
    const path = pathStr.chars();
    const expandedPath = [...path, "?", ...path, "?", ...path, "?", ...path, "?", ...path, "."];
    // path.push("."); // extra blank so we can always match a dot after
    const plan = planStr.split(",").map((x) => x.toInt());
    const expandedPlan = [...plan, ...plan, ...plan, ...plan, ...plan];
    return { path: expandedPath, plan: expandedPlan };
  });

  const countSolutionsToCR = (cr: ConditionReport): number => {
    const crIndex = cr.path.indexOf("?");

    if (crIndex === -1) {
      if (isValid2(cr)) {
        return 1;
      } else {
        return 0;
      }
    }

    if (!couldBeValid2(cr)) {
      return 0;
    }
    cr.path[crIndex] = "#";
    const countA = countSolutionsToCR(cr);
    cr.path[crIndex] = ".";
    const countB = countSolutionsToCR(cr);
    cr.path[crIndex] = "?"; // discarded

    if (countA === 0 && countB === 0) {
      const regex = couldBeValid2RegexForCr(cr.plan);
      console.log("not flagged:", cr.path.join(""), cr.plan, regex);
      throw new Error("missed flag");
    }

    return countA + countB;
  };

  let results = [];
  let sum = 0;
  let i = 1;
  for (const cr of conditionReports) {
    console.time(`countSolutionsToCR ${i}`);
    const count = countSolutionsToCR(cr);
    console.timeEnd(`countSolutionsToCR ${i}`);
    sum += count;
    console.log(`${i}: ${cr.path.join("")}: ${count}`);
    results.push({ i, path: cr.path.join(""), count });
    fs.writeFileSync("results.json", JSON.stringify(results, null, 2));
    i++;
  }

  return sum;
}
