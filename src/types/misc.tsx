export type RankNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type RankName = 'ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' |
 '10' | 'jack' | 'queen' | 'king';
export type Suit = 'clubs' | 'diamonds' | 'hearts' | 'spades';
export type CardType = 'ace' | 'face' | 'number' ; //stone;
export type Enhancement = "bonus" | "mult" | "wild" | "glass" | "steel" |
  "stone" | "gold" | "lucky";
export type SpecialCardMod = "foil" | "holo" | "poly";
type SpecialJokerMod = SpecialCardMod;
export type Seal = "red" | "blue" | "purple" | "gold";

export type Card = {
  suit: Suit,
  rank: RankNum,
  name: RankName,
  cardType: CardType,
  enhanced: Enhancement | null,
  special: SpecialCardMod | null,
  seal: Seal | null,
}

export type CardComponent = Card & {id: number, selected: boolean};
// type Hand = Card[];

export type Joker = {
  name: string,
  special: SpecialJokerMod | null, //holo, foil, poly
  negative: boolean,
  price: number,
  sellValue: number
}

/*
{
  bestHand: 'flush',
  highScore: 600,
  handTypes: [flush, threeOf, pair],
  hands {
    royalFlush: undefined,
    straightFlush: undefined,
    straight: undefined,
    flush: [Card1, Card2, ...],
    fiveOf: undefined,
    fourOf: undefined,
    threeOf: [Card1, Card2, ...],
    pair: [Card1, Card2],
    twoPair: undefined,
    fullHouse: undefined,
  }
}
*/
export type HandTypes = 'highCard' | 'pair' | 'threeOf' | 'fourOf' |
  'fiveOf' | 'twoPair' | 'fullHouse' |
  'flush' | 'straight' | 'straightFlush' | 'royalFlush';

//FIXME: string is less specific, but using HandTypes or [key in HandTypes]: Card[]
//has TS expect ALL of the provided handtypes
export type HandInfo = {
  bestHand: HandTypes,
  highScore: number,
  handTypes: HandTypes[]
  scoringHands: Record<string, Card[]>;
}