import fs from "fs";

const input = fs.readFileSync(`${__dirname}/input`, "utf8");

type Cubes = {
  [key: string]: number;
};

const available: Cubes = {
  red: 12,
  green: 13,
  blue: 14,
};

const parse = (input: string) =>
  input
    .replaceAll(/[\:;]/g, ",")
    .split("\n")
    .map((x) => {
      const [game, ...cubes] = x.split(", ").map((x) => x.split(" "));
      return {
        //@ts-ignore
        id: parseInt(game?.at(-1)),
        cubes: cubes.reduce(
          (carry, [value, key]) => {
            if (parseInt(value) > carry[key]) {
              carry[key] = parseInt(value);
            }
            return carry;
          },
          {
            blue: 0,
            green: 0,
            red: 0,
          } as Cubes
        ),
      };
    });

const sum = (items: number[]) => items.reduce((sum, item) => sum + item, 0);

const sol1 = parse(input).reduce((sum, game) => {
  return Object.entries(available).every(([color, x]) => game.cubes[color] <= x)
    ? sum + game.id
    : sum;
}, 0);

const sol2 = parse(input).reduce((sum, { cubes }) => {
  return sum + cubes.red * cubes.blue * cubes.green;
}, 0);

console.log({ sol1, sol2 });
