import fs from "fs";

const input = fs.readFileSync(`${__dirname}/input`, "utf8");

const words = {
  zero: "ze0o",
  one: "o1e",
  two: "t2e",
  three: "thr3e",
  four: "fou4r",
  five: "fiv5e",
  six: "s6x",
  seven: "sev7n",
  eight: "eig8t",
  nine: "nin9e",
};

const sanitize = (str: string): string => {
  return Object.entries(words).reduce(
    (carry, [word, value]) => carry.replaceAll(word, value),
    str
  );
};

const parse = (data: string[]) =>
  data.map((entry: string) => {
    const nums = entry.split("").filter((x) => !isNaN(parseInt(x)));
    return parseInt([nums.at(0), nums.at(-1)].join(""));
  });

const sum = (items: number[]) => items.reduce((sum, item) => sum + item, 0);
const sol1 = sum(parse(input.split("\n")));
const sol2 = sum(parse(sanitize(input).split("\n")));

console.log({ sol1, sol2 });
