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
  chip: number,
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
  sellValue: number,
  activePhase: string,
  description: string
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
  'fiveOf' | 'flushFive' | 'twoPair' | 'fullHouse' | 'flushHouse' |
  'flush' | 'straight' | 'straightFlush' | 'royalFlush';

//FIXME: string is less specific, but using HandTypes or [key in HandTypes]: Card[]
//has TS expect ALL of the provided handtypes
export type HandStatus = {
  hand: Card[],
  bestHand: HandTypes,
  highScore: number,
  handTypes: HandTypes[]
  scoredCards: Record<string, boolean[]>;
}

export type DeckStatus = {
  deck: Card[],
  dealtCards: Card[], //handSize active cards, can be played or discarded.
  selectedCards: Card[],
  playedCards: Card[],
  unplayedCards: Card[],
  usedCards: Card[], //discarded or played
  remainingCards: Card[], //deck remaining
}

type RunStatus = {
  vouchers: VoucherTypes[],
  handTypesInfo: {},
  currentRound: number,
  currentAnte: number,
  currentMoney: number,
}

type RoundStatus = {
  handsLeft: number,
  discardsLeft: number,
  handSize: number,

  scoreForRound: number,
  chipSoFar: number,
  multSoFar: number,
}

/*
type RunInfo = {
  deck: Card[],
  dealtCards: Card[], //handSize active cards, can be played or discarded.
  selectedCards: Card[],
  playedCards: Card[],
  unplayedCards: Card[],
  usedCards: Card[], //discarded or played
  remainingCards: Card[], //deck remaining

  vouchers: VoucherTypes[],
  handTypesInfo: {},

  currentRound: number,
  currentAnte: number,
  currentMoney: number,

  handsLeft: number,
  discardsLeft: number,
  handSize: number,

  scoreForRound: number,
  chipSoFar: number,
  multSoFar: number,
}
*/

type VoucherTypes = 'blank' | 'bossReroll' | 'clearance' | 'consumable' |
  'discardsLeft' | 'handsLeft' | 'handSize' | 'hieroglyph' | 'overstock' |
  'planet' | 'reroll' | 'seedMoney' | 'shopCards' | 'specialCards' |
  'tarot' | 'telescope';