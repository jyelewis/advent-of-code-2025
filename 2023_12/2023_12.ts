import { memo } from "../utilities";

// TODO: clean & simplify me!!

interface ConditionReport {
  path: string;
  plan: number[];
}

export function day2023_12a(input: string) {
  const conditionReports: ConditionReport[] = input.lines().map((line) => {
    const [path, planStr] = line.split(" ");
    const plan = planStr.split(",").map((x) => x.toInt());
    return { path, plan };
  });

  const countSolutionsToCR = memo((path: string, plan: number[]): number => {
    // some base cases
    if (path.startsWith(".")) {
      // trim away dots at the start
      return countSolutionsToCR(path.replace(/^\.+/, ""), plan);
    }

    if (plan.length === 0) {
      // we have no further broken items to match
      if (path.includes("#")) {
        // but we have one in our path... no valid solutions here
        return 0;
      } else {
        // only working or unknown, one valid solution (all working)
        return 1;
      }
    }

    // we're trying to match the first item in the plan
    const nextBrokenSize = plan[0];

    if (nextBrokenSize > path.length) {
      // we don't have enough space left in our path to have the required broken item, must not be valid
      return 0;
    }

    let count = 0;
    if (path[0] === "?") {
      // what if this first unknown was a .?
      count += countSolutionsToCR(path.substring(1), plan);
    }

    // [nextBrokenSize] chars aren't '.', and we are followed by a dot or question
    const nextBrokenCouldFit = !path.substring(0, nextBrokenSize).includes(".") && path[nextBrokenSize] !== "#";
    if (nextBrokenCouldFit) {
      // ok we could fit this item in here, what if we took that path? (remember to trim the following dot away)
      count += countSolutionsToCR(path.substring(nextBrokenSize + 1), plan.slice(1));
    }

    return count;
  });

  for (const cr of conditionReports) {
    const count = countSolutionsToCR(cr.path, cr.plan);
    console.log(`${cr.path} ${cr.plan.join(",")}: ${count}`);
  }

  return conditionReports.map((cr) => countSolutionsToCR(cr.path, cr.plan)).sum();
}

export function day2023_12b(input: string) {
  const conditionReports: ConditionReport[] = input.lines().map((line) => {
    const [pathStr, planStr] = line.split(" ");
    const path = pathStr.chars();
    const expandedPath = [...path, "?", ...path, "?", ...path, "?", ...path, "?", ...path, "."];
    // path.push("."); // extra blank so we can always match a dot after
    const plan = planStr.split(",").map((x) => x.toInt());
    const expandedPlan = [...plan, ...plan, ...plan, ...plan, ...plan];
    return { path: expandedPath.join(""), plan: expandedPlan };
  });

  const countSolutionsToCR = memo((path: string, plan: number[]): number => {
    // some base cases
    if (path.startsWith(".")) {
      // trim away dots at the start
      return countSolutionsToCR(path.replace(/^\.+/, ""), plan);
    }

    if (plan.length === 0) {
      // we have no further broken items to match
      if (path.includes("#")) {
        // but we have one in our path... no valid solutions here
        return 0;
      } else {
        // only working or unknown, one valid solution (all working)
        return 1;
      }
    }

    // we're trying to match the first item in the plan
    const nextBrokenSize = plan[0];

    if (nextBrokenSize > path.length) {
      // we don't have enough space left in our path to have the required broken item, must not be valid
      return 0;
    }

    let count = 0;
    if (path[0] === "?") {
      // what if this first unknown was a .?
      count += countSolutionsToCR(path.substring(1), plan);
    }

    // [nextBrokenSize] chars aren't '.', and we are followed by a dot or question
    const nextBrokenCouldFit = !path.substring(0, nextBrokenSize).includes(".") && path[nextBrokenSize] !== "#";
    if (nextBrokenCouldFit) {
      // ok we could fit this item in here, what if we took that path? (remember to trim the following dot away)
      count += countSolutionsToCR(path.substring(nextBrokenSize + 1), plan.slice(1));
    }

    return count;
  });

  for (const cr of conditionReports) {
    const count = countSolutionsToCR(cr.path, cr.plan);
    console.log(`${cr.path} ${cr.plan.join(",")}: ${count}`);
  }

  return conditionReports.map((cr) => countSolutionsToCR(cr.path, cr.plan)).sum();
}
