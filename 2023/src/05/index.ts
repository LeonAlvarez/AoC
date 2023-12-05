import fs from "fs";

const input = (file: string) => fs.readFileSync(`${__dirname}/${file}`, "utf8");

const inRange = (x: number, start: number, end: number) =>
  x >= start && x < end;

const chunk = (items: any[], length: number) =>
  Array.from({ length: Math.ceil(items.length / length) }, (_, i) =>
    items.slice(i * length, i * length + length)
  );
type Garden = {
  source: {
    start: number;
    end: number;
  };
  destination: {
    start: number;
    end: number;
  };
};

const parse = (input: string) => {
  const [rawSeeds, ...rawGardens] = input.split("\n\n");
  return {
    seeds: rawSeeds.split(": ").at(-1)?.split(" ").map(Number) || [],
    gardens: rawGardens.map((garden) => {
      const [, ...data] = garden.replace(" map: ", "").split("\n");
      return data.map((x) => {
        const [destination, source, range] = x.split(" ").map(Number);
        return {
          source: { start: source, end: source + range - 1 },
          destination: { start: destination, end: destination + range - 1 },
        };
      });
    }) as Garden[][],
  };
};

const sol1 = (input: string) => {
  const { seeds, gardens } = parse(input);
  return getLowestLocation(seeds, gardens);
};

const getLowestLocation = (seeds: number[], gardens: Garden[][]) => {
  return Math.min(
    ...seeds.map((seed) => {
      return gardens.reduce((carry, garden: Garden[]) => {
        const match = garden.find(({ source }) =>
          inRange(carry, source.start, source.end + 1)
        );
        return match
          ? match.destination.start - match.source.start + carry
          : carry;
      }, seed);
    })
  );
};

function transformSeed(gardens: Garden[][], start: number) {
  return gardens.reduceRight((carry, garden) => {
    const m = garden.find(({ destination }) =>
      inRange(carry, destination.start, destination.end + 1)
    );
    return m ? m.source.start + (carry - m.destination.start) : carry;
  }, start);
}

const sol2 = (input: string) => {
  const { seeds: seedRanges, gardens } = parse(input);
  const seeds = chunk(seedRanges, 2);

  return gardens
    .flatMap((garden, i) =>
      garden.map((g) =>
        transformSeed(gardens.slice(0, i + 1), g.destination.start)
      )
    )
    .reduce((carry, seed) => {
      if (
        seeds.some(([start, length]) => inRange(seed, start, start + length))
      ) {
        const location = getLowestLocation([seed], gardens);
        if (location < carry) return location;
      }
      return carry;
    }, Number.MAX_VALUE);
};

console.time("start");
const parsed = input("input");
console.log({
  sol1: sol1(parsed),
  sol2: sol2(parsed),
});
console.timeEnd("start");

// function* range(start = 0, end = Infinity, step = 1) {
//     for (let i = start; i < end; i += step) {
//       yield i;
//     }
//   }

// const sol2Brute = (input: string) => {
//   const { seeds: seedRanges, gardens } = parse(input);
//   return chunk(seedRanges, 2).reduce((carry, [start, length]) => {
//     let minLocation = carry;
//     for (let seed of range(start, start + length - 1)) {
//       const location = getLowestLocation([seed], gardens);
//       if (location < minLocation) minLocation = location;
//     }
//     return minLocation;
//   }, Number.MAX_VALUE);
// };
