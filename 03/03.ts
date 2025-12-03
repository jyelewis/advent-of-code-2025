import { range } from "../utilities";

export function largestJoltageForBank(bank: number[], numDigits: number) {
  const digits = [];
  for (const digitsRemaining of range(numDigits - 1, 0, -1)) {
    // calculate the options for the largest digit we can pick, we need to leave enough digits for the remaining places
    const largestDigitOptions = bank.slice(0, bank.length - digitsRemaining);

    // pick the largest digit from the options
    const largestDigit = Math.max(...largestDigitOptions);
    digits.push(largestDigit);

    // remove this digit & everything proceeding it from the bank
    const largestDigitIndex = bank.findIndex((x) => x === largestDigit);
    bank = bank.slice(largestDigitIndex + 1);
  }

  return digits.join("").toInt();
}

export function day03(input: string) {
  const banks = input.lines().map((line) => line.chars().map((c) => c.toInt()));

  return {
    partA: banks.map((bank) => largestJoltageForBank(bank, 2)).sum(),
    partB: banks.map((bank) => largestJoltageForBank(bank, 12)).sum(),
  };
}
