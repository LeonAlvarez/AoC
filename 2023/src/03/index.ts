import fs from "fs";

const input = fs.readFileSync(`${__dirname}/input`, "utf8").split("\n");

type Gear = {
  gear: number;
  start: number;
  end: number;
  y: number;
};

type Symbol = {
  symbol: string;
  x: number;
  y: number;
};

type Parsed = {
  symbols: Symbol[];
  gears: Gear[];
};

const parse = (input: string[]) => {
  return input.reduce(
    (carry, line, i) => {
      const { symbols, gears } = line.split("").reduce(
        (carry, char, j) => {
          if (!isNaN(parseInt(char))) {
            const current = `${carry.current}${char}`;
            return {
              current: current,
              start: carry.current.length > 0 ? carry.start : j,
              symbols: carry.symbols,
              gears:
                j == line.length - 1
                  ? carry.gears.concat([
                      {
                        start: carry.start,
                        end: j,
                        gear: parseInt(current),
                        y: i,
                      },
                    ])
                  : carry.gears,
            };
          }

          if (carry.current.length) {
            carry.gears.push({
              start: carry.start,
              end: j - 1,
              gear: parseInt(carry.current),
              y: i,
            });
            carry.start = 0;
            carry.current = "";
          }

          if (char !== ".") {
            carry.symbols.push({
              symbol: char,
              x: j,
              y: i,
            });
          }

          return carry;
        },
        {
          current: "",
          start: 0,
          symbols: [] as Symbol[],
          gears: [] as Gear[],
        }
      );

      carry.symbols = carry.symbols.concat(symbols);
      carry.gears = carry.gears.concat(gears);
      return carry;
    },
    { symbols: [] as Symbol[], gears: [] as Gear[] }
  );
};

const parsed = parse(input);

const checkAdjacentGear = (gear: Gear, symbol: Symbol) => {
  if (Math.abs(symbol.y - gear.y) > 1) return false;
  if (symbol.x <= gear.end + 1 && symbol.x >= gear.start - 1) return true;
};

const sol1 = (parsed: Parsed) =>
  parsed.gears
    .filter((gear) => {
      return parsed.symbols.some((symbol) => checkAdjacentGear(gear, symbol));
    })
    .reduce((sum, { gear }) => sum + gear, 0);

const sol2 = (parsed: Parsed) =>
  parsed.symbols
    .filter(({ symbol }) => symbol === "*")
    .reduce((sum, symbol) => {
      const ratios = parsed.gears.filter((gear) =>
        checkAdjacentGear(gear, symbol)
      );
      return ratios.length === 2 ? sum + ratios[0].gear * ratios[1].gear : sum;
    }, 0);

console.log({ sol1: sol1(parsed), sol2: sol2(parsed) });
