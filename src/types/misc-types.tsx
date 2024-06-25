type Enhancements = "bonus" | "mult" | "wild" | "glass" | "steel" |
  "stone" | "gold" | "lucky";
type SpecialCardMods = "foil" | "holo" | "poly";
type SpecialJokerMods = SpecialCardMods;
type Seals = "red" | "blue" | "purple" | "gold";

export type Card = {
  rank: number,
  suit: 'clubs' | 'diamonds' | 'hearts' | 'spades' //string,
  type: 'ace' | 'face' | 'number' | 'stone'
  enhanced: Enhancements | null, //
  special: SpecialCardMods | null,
  seal: Seals | null
}

// type Hand = Card[];

export type Joker = {
  name: string,
  special: SpecialJokerMods | null, //holo, foil, poly
  negative: boolean,
  price: number,
  sellValue: number
}