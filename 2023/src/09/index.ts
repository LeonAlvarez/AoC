import fs from "fs";

const input = (file: string) => fs.readFileSync(`${__dirname}/${file}`, "utf8");

const parse = (input: string) => {
  return input.split("\n").map((x) => x.split(" ").map(Number));
};

const solveOne = (data: number[][]) =>
  data.reduce((sum, row) => sum + nextValue(row), 0);

const solveTwo = (data: number[][]) =>
  data.reduce((sum, row) => sum + nextValue(row, true), 0);

const nextValue = (numbers: number[], backwards = false): number => {
  let row = [...numbers];
  let next = [row.at(backwards ? 0 : -1)] as number[];

  while (!row.every((x) => x === row[0])) {
    row = row.slice(1).map((x, i) => x - row[i]);
    next.push(row.at(backwards ? 0 : -1) as number);
  }

  return backwards
    ? next.reverse().reduce((sum, x) => {
        return x - sum;
      }, 0)
    : next.reduce((sum, x) => sum + x, 0);
};

const parsed = parse(input("input"));

const sol1 = solveOne(parsed);
const sol2 = solveTwo(parsed);

console.log({
  sol1,
  sol2,
});
