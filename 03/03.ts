import { range } from "../utilities";

export function largestJoltageForBank(bank: number[], numDigits: number) {
  const digits: number[] = [];
  for (const digitIndex of range(numDigits - 1, 0, -1)) {
    // calculate the options for the largest digit we can pick, we need to leave enough digits for the remaining places
    const largestDigitOptions = bank.slice(0, bank.length - digitIndex);

    // pick the largest digit from the options
    const largestDigit = Math.max(...largestDigitOptions);
    digits.push(largestDigit);

    // remove this digit from the bank
    const largestDigitIndex = bank.findIndex((x) => x === largestDigit);
    bank = bank.slice(largestDigitIndex + 1);
  }

  return parseInt(digits.join(""), 10);
}

export function day03(input: string) {
  const banks = input.lines().map((line) => line.numbers());

  return {
    partA: banks.map((bank) => largestJoltageForBank(bank, 2)).sum(),
    partB: banks.map((bank) => largestJoltageForBank(bank, 12)).sum(),
  };
}
