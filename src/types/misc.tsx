export type RankNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type Suits = 'clubs' | 'diamonds' | 'hearts' | 'spades';
type Enhancements = "bonus" | "mult" | "wild" | "glass" | "steel" |
  "stone" | "gold" | "lucky";
type SpecialCardMods = "foil" | "holo" | "poly";
type SpecialJokerMods = SpecialCardMods;
type Seals = "red" | "blue" | "purple" | "gold";

export type Card = {
  rank: RankNum,
  type: 'ace' | 'face' | 'number' | 'stone',
  suit: 'clubs' | 'diamonds' | 'hearts' | 'spades',
  enhanced: Enhancements | null,
  special: SpecialCardMods | null,
  seal: Seals | null,
}

export type CardComponent = Card & {id: number, selected: boolean};
// type Hand = Card[];

export type Joker = {
  name: string,
  special: SpecialJokerMods | null, //holo, foil, poly
  negative: boolean,
  price: number,
  sellValue: number
}