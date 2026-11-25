import { memo } from "../utilities";

export function day2023_12a(input: string) {
  const countSolutionsToCR = memo((path: string, plan: number[]): number => {
    // some base cases
    if (path.startsWith(".")) {
      // trim away dots at the start
      return countSolutionsToCR(path.replace(/^\.+/, ""), plan);
    }

    if (plan.length === 0) {
      // we have no further broken items to match
      // if there are more broken items, this solution isn't valid
      // if there are non, it's valid if all optionals are fixed
      return path.includes("#") ? 0 : 1;
    }

    if (plan[0] > path.length) {
      // we don't have enough space left in our path to have the required broken item, must not be valid
      return 0;
    }

    let count = 0;
    if (path[0] === "?") {
      // what if this first unknown was a .?
      count += countSolutionsToCR(path.substring(1), plan);
    }

    // plan[0] chars aren't '.', and we are followed by a dot or question
    const nextBrokenCouldFit = !path.substring(0, plan[0]).includes(".") && path[plan[0]] !== "#";
    if (nextBrokenCouldFit) {
      // ok we could fit this item in here, what if we took that path? (remember to trim the following dot away)
      count += countSolutionsToCR(path.substring(plan[0] + 1), plan.slice(1));
    }

    return count;
  });

  return input
    .lines()
    .map((line) => {
      const [path, planStr] = line.split(" ");
      const plan = planStr.split(",").map((x) => x.toInt());
      return countSolutionsToCR(path, plan);
    })
    .sum();
}

export function day2023_12b(input: string) {
  const expandedInput = input
    .lines()
    .map((line) => {
      const [path, plan] = line.split(" ");
      return `${new Array(5).fill(path).join("?")} ${new Array(5).fill(plan).join(",")}`;
    })
    .join("\n");

  return day2023_12a(expandedInput);
}
