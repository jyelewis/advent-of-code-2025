export const sscanf =
  (staticSections: TemplateStringsArray, ...types: any[]) =>
  (input: string): any[] => {
    let rest = input;
    const outputValues: any[] = [];

    for (let i = 0; i < types.length; i++) {
      const staticSection = staticSections[i];
      if (!rest.startsWith(staticSection)) {
        throw new Error(`Failed to parse, was expecting "${staticSection}" but got "${rest}" (input: "${input}")`);
      }
      rest = rest.slice(staticSection.length);

      const type = types[i];
      switch (type) {
        case Number: {
          const match = rest.match(/^[0-9\.]+/);
          if (!match) {
            throw new Error(`Failed to parse, was expecting a number but got "${rest}" (input: "${input}")`);
          }
          const numStr = match[0];
          const numValue = parseFloat(numStr);
          outputValues.push(numValue);
          rest = rest.slice(numStr.length);
          break;
        }
        case String: {
          const nextSection = staticSections[i + 1];
          const endIdx = nextSection ? rest.indexOf(nextSection) : rest.length;
          if (endIdx === -1) {
            throw new Error(
              `Failed to parse, was expecting a string followed by "${nextSection}" but got "${rest}" (input: "${input}")`,
            );
          }
          outputValues.push(rest.slice(0, endIdx));
          rest = rest.slice(endIdx);
          break;
        }
        default:
          throw new Error(`Unknown type: ${type}`);
      }
    }

    const lastSection = staticSections[staticSections.length - 1];
    if (!rest.startsWith(lastSection)) {
      throw new Error(
        `Failed to parse, was expecting "${lastSection}" at the end but got "${rest}" (input: "${input}")`,
      );
    }

    return outputValues;
  };
