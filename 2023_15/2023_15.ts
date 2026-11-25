import "../utilities";

function hash(str: string) {
  return str.chars().reduce((val, c) => {
    val += c.charCodeAt(0);
    val *= 17;
    val = val % 256;
    return val;
  }, 0);
}

export function day2023_15a(input: string) {
  return input.split(",").map(hash).sum();
}

export function day2023_15b(input: string) {
  const boxes: Array<{ label: string; focalLength: number }[]> = Array(256)
    .fill(null)
    .map(() => []);

  for (const instr of input.split(",")) {
    const label = instr.split(/[-=]/)[0];
    const operation = instr.substring(label.length, label.length + 1);
    const focalLength = operation === "=" ? instr.substring(instr.length - 1, instr.length).toInt() : 0;
    const box = boxes[hash(label)];

    const existingIdx = box.findIndex((x) => x.label === label);
    // remove existing lens, if present
    if (existingIdx !== -1) {
      box.splice(existingIdx, 1);
    }

    // insert replacement, either in old position or at end of stack
    if (operation === "=") {
      if (existingIdx !== -1) {
        box.splice(existingIdx, 0, { label, focalLength });
      } else {
        box.push({ label, focalLength });
      }
    }
  }

  // add up focusing power
  return boxes
    .map((box, boxIdx) => box.map((lens, lensIdx) => (boxIdx + 1) * (lensIdx + 1) * lens.focalLength).sum())
    .sum();
}
