import fs from "fs";

const input = (file: string) => fs.readFileSync(`${__dirname}/${file}`, "utf8");

type Data = {
  instructions: ("L" | "R")[];
  navigation: {
    [key: string]: {
      L: string;
      R: string;
    };
  };
};

const mcd = (a: number, b: number) => {
  if (a === 0 || b === 0) return 0;

  while (a !== b) {
    if (a > b) {
      a -= b;
    } else {
      b -= a;
    }
  }

  return a;
};

const mcm = (numbers: number[]) => {
  if (numbers.length === 0) return 0;

  if (numbers.every((n) => n === numbers[0])) return numbers[0];

  if (!numbers.reduce((acc, n) => mcd(acc, n), 1)) return 0;

  return numbers.reduce((acc, n) => (acc * n) / mcd(acc, n), 1);
};

const parse = (input: string) => {
  const [instructions, navigationRaw] = input.split("\n\n");
  return {
    instructions: instructions.split("") as ("L" | "R")[],
    navigation: navigationRaw.split("\n").reduce((carry: any, line) => {
      const match = line.match(/[A-Z\d]{3}/gi);
      if (!match) return carry;
      carry[match[0]] = {
        L: match[1],
        R: match[2],
      };
      return carry;
    }, {} as Data),
  };
};

const solveOne = ({
  data: { instructions, navigation },
  target = "ZZZ",
  start = "AAA",
}: {
  data: Data;
  target?: string;
  start?: string;
}) => {
  let steps = 0;
  let current = start;
  while ((target && current !== target) || current.at(2) !== "Z") {
    const instruction = instructions[steps % instructions.length];
    steps++;
    current = navigation[current][instruction];
  }

  return steps;
};

const solveTwo = async (data: Data) => {
  return mcm(
    await Promise.all(
      Object.keys(data.navigation)
        .filter((x) => x.at(2) === "A")
        .map((current) =>
          solveOne({
            data,
            start: current,
            target: "",
          })
        )
    )
  );
};

(async () => {
  const parsed = parse(input("input"));
  const sol1 = await solveOne({ data: parsed });
  const sol2 = await solveTwo(parsed);

  console.log({
    sol1,
    sol2,
  });
})();
