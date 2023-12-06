import fs from "fs";

const input = (file: string) => fs.readFileSync(`${__dirname}/${file}`, "utf8");

type Race = {
  time: number;
  distance: number;
};

const parse = (input: string) => {
  const [times, distances] = input
    .replaceAll(/ +/g, " ")
    .split("\n")
    .map((x) => {
      const [_, ...values] = x.split(" ");
      return values.map(Number);
    });

  return times.reduce((carry, time, i) => {
    carry.push({
      time,
      distance: distances[i],
    });
    return carry;
  }, [] as Race[]);
};

const getMaxPressTime = (
  optimalPressTime: number,
  maxTime: number,
  maxDistance: number
) => {
  let maxPressTime = optimalPressTime;
  while ((maxPressTime + 1) * (maxTime - maxPressTime - 1) > maxDistance) {
    maxPressTime++;
  }
  return maxPressTime;
};

const getMinPressTime = (
  optimalPressTime: number,
  maxTime: number,
  maxDistance: number
) => {
  let minPressTime = optimalPressTime;
  while ((minPressTime - 1) * (maxTime - minPressTime + 1) > maxDistance) {
    minPressTime--;
  }
  return minPressTime;
};

function solveOne(races: Race[]) {
  return races.reduce((carry, { time, distance }) => {
    const optimalPressTime = Math.floor(time / 2);
    const maxDistance = optimalPressTime * (time - optimalPressTime);

    if (maxDistance <= distance) {
      return carry;
    }

    const minPressTime = getMinPressTime(optimalPressTime, time, distance);
    const maxPressTime = getMaxPressTime(optimalPressTime, time, distance);

    return carry * (maxPressTime - minPressTime + 1);
  }, 1);
}

const solveTwo = (races: Race[]) => {
  const race = races.reduce((carry, race) => {
    if (!carry.time) {
      return race;
    }

    carry.time = Number(`${carry.time}${race.time}`);
    carry.distance = Number(`${carry.distance}${race.distance}`);
    return carry;
  }, {} as Race);

  return solveOne([race]);
};

const parsed = parse(input("input"));
console.log({ sol1: solveOne(parsed), sol2: solveTwo(parsed) });
