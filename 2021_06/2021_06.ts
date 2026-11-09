import { range } from "../utilities";

export function countFish(input: string, days: number) {
  const fishForBirthingDay = new Array(7).fill(0);
  const babyFish = new Array(7).fill(0);

  // our first day is on birthing day 0: load-em-in
  input.split(",").forEach((f) => fishForBirthingDay[f.toInt()]++);

  for (const day of range(days)) {
    const birthingDay = day % 7;

    // spawn in babies
    const babyFishBirthingDay = (birthingDay + 2) % 7;
    babyFish[babyFishBirthingDay] += fishForBirthingDay[birthingDay];

    // mark last week's babies as matured
    fishForBirthingDay[birthingDay] += babyFish[birthingDay];
    babyFish[birthingDay] = 0;
  }

  return fishForBirthingDay.sum() + babyFish.sum();
}

export function day2021_06(input: string) {
  return {
    partA: countFish(input, 80),
    partB: countFish(input, 256),
  };
}
