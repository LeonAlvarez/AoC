import fs from "fs";

const input = fs
  .readFileSync(`${__dirname}/input`, "utf8")
  .replaceAll("  ", " ")
  .split("\n");

const intersect = (a: number[], b: number[]) => {
  const setA = new Set(a);
  return b.filter((value) => setA.has(value));
};

const parse = (input: string[]) => {
  return input.map((line) =>
    line
      .split(": ")[1]
      .split("|")
      .map((x) =>
        x
          .trim()
          .split(" ")
          .map((n) => parseInt(n))
      )
  );
};

const sol1 = (parsed: number[][][]) =>
  parsed.reduce((sum, [winning, numbers]) => {
    const wins = intersect(winning, numbers).length;
    return wins > 0 ? sum + Math.pow(2, wins - 1) : sum;
  }, 0);

const sol2 = (parsed: number[][][]) =>
  parsed
    .reduce((carry, [winning, numbers], i) => {
      const wins = intersect(winning, numbers).length;
      return [...Array(carry[i]).keys()].reduce((carry, _) => {
        return [...Array(wins).keys()]
          .map((j) => j + i + 1)
          .reduce((carry, win) => {
            carry[win]++;
            return carry;
          }, carry);
      }, carry);
    }, new Array(parsed.length).fill(1))
    .reduce((sum, x) => sum + x, 0);

const parsed = parse(input);

console.log({ sol1: sol1(parsed), sol2: sol2(parsed) });
