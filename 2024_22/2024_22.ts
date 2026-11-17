import { range } from "../utilities";
import assert from "node:assert";

export function day2024_22a(input: string) {
  return input
    .lines()
    .map((x) => x.toInt())
    .map((initialSecretNumber) => {
      let number = initialSecretNumber;
      for (const i of range(2000)) {
        number = nextSecretNumber(number);
      }

      return number;
    })
    .sum();
}

export function nextSecretNumber(input: number): number {
  // could be faster with bitwise operations? But fast enough as-is, at least this way reads 1:1 with the instructions
  let number = BigInt(input);
  const pruneVal = BigInt(16777216);

  // Calculate the result of multiplying the secret number by 64. Then, mix this result into the secret number. Finally, prune the secret number.
  number = (number ^ (number * BigInt(64))) % pruneVal;
  assert(number > 0);

  // Calculate the result of dividing the secret number by 32. Round the result down to the nearest integer. Then, mix this result into the secret number. Finally, prune the secret number.
  number = (number ^ (number / BigInt(32))) % pruneVal;
  assert(number > 0);

  // Calculate the result of multiplying the secret number by 2048. Then, mix this result into the secret number. Finally, prune the secret number
  number = (number ^ (number * BigInt(2048))) % pruneVal;
  assert(number > 0);

  return Number(number);
}

export function day2024_22b(input: string) {
  const initialSecretNumbers = input.lines().map((x) => x.toInt());
  const allDeltas = initialSecretNumbers.map((initialSecretNumber) => {
    // for each monkey
    let number = initialSecretNumber;

    // for each secret number, calculate the price & delta from prev price
    return range(2000).map(() => {
      const lastPrice = number % 10;
      number = nextSecretNumber(number);
      const newPrice = number % 10;

      const delta = newPrice - lastPrice;

      return { price: newPrice, delta };
    });
  });

  // window walk each delta array and for each four sequence delta array track which sales could be made
  const sequencePrices = new Map<number, number>();
  for (const monkeyDeltas of allDeltas) {
    const moneySequencesSet = new Set<number>();
    for (const lastChangeIndex of range(3, 1999)) {
      // faster way to calculate a value that represents a unique sequence
      let sequenceFast = 0;
      for (let i = 0; i <= 3; i++) {
        const monkeyIndex = lastChangeIndex - 3 + i;
        sequenceFast += monkeyDeltas[monkeyIndex].delta * Math.pow(12, i);
      }

      const price = monkeyDeltas[lastChangeIndex].price;

      // once a sequence has been taken for this monkey we can't add it again later! Already sold our secret
      if (!moneySequencesSet.has(sequenceFast)) {
        const existingValue = sequencePrices.get(sequenceFast) || 0;
        sequencePrices.set(sequenceFast, existingValue + price);
      }
      moneySequencesSet.add(sequenceFast);
    }
  }

  // find the best possible price from our available sequences
  const orderedSequences = sequencePrices
    .entries()
    .map(([sequence, totalPrice]) => ({ sequence, totalPrice }))
    .toArray()
    .toSorted((a, b) => b.totalPrice - a.totalPrice);

  return orderedSequences[0].totalPrice;
}
