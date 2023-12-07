import fs from "fs";

const input = (file: string) => fs.readFileSync(`${__dirname}/${file}`, "utf8");

type Card = 14 | 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1;

type Groups = Partial<Record<Card, number>>;
type Kind = number;

type Hand = {
  cards: Card[];
  bid: number;
  groups: Groups;
  kind: Kind;
};

const parse = (input: string) => {
  const hands = input.split("\n").map((line) => {
    const [hand, bid] = line.split(" ");
    const cards = hand
      .split("")
      .map((card) =>
        Number(
          card
            .replace("A", "14")
            .replace("K", "13")
            .replace("Q", "12")
            .replace("J", "11")
            .replace("T", "10")
        )
      ) as Card[];

    const groups = cards.reduce((carry: any, card) => {
      carry[card] = carry[card] ? carry[card] + 1 : 1;
      return carry;
    }, {}) as Groups;

    return {
      bid: Number(bid),
      cards,
      groups,
      kind: getHighestKind(groups),
    } as Hand;
  });
  return hands;
};

const getHighestKind = (groups: Groups): number => {
  const [highest, second] = Object.values(groups)
    .map(Number)
    .sort((a, b) => b - a);
  if (highest >= 4) return highest + 2;
  if (highest == 3) return second === 2 ? 5 : 4;
  if (highest === 2 && second == 2) return 3;

  return highest;
};

const getKindWithNewRules = (hand: Hand) => {
  const { kind, groups } = hand;
  if (kind == 7 || !groups[11]) return kind;
  if (kind == 1) return 2;
  if (kind == 3 && groups[11] == 2) return 6;

  return kind < 6 ? kind + 2 : 7;
};

const compareHands = (a: Hand, b: Hand) => {
  if (a.kind !== b.kind) return a.kind - b.kind;

  for (let i = 0; i < a.cards.length; i++) {
    if (a.cards[i] !== b.cards[i]) {
      return a.cards[i] - b.cards[i];
    }
  }

  return 0;
};

const solveOne = (hands: Hand[]) =>
  hands
    .toSorted(compareHands)
    .reduce((sum, { bid }, i) => sum + bid * (i + 1), 0);

const solveTwo = (hands: Hand[]) => {
  solveOne(
    hands.map((hand) => {
      return {
        ...hand,
        cards: hand.cards.map((c) => (c == 11 ? 1 : c)),
        kind: getKindWithNewRules(hand),
      };
    })
  );
};

const parsed = parse(input("input"));

console.log({
  sol1: solveOne(parsed),
  sol2: solveTwo(parsed),
});
