export type RankNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type RankName = 'ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' |
 '10' | 'jack' | 'queen' | 'king';
export type Suit = 'hearts' | 'diamonds' | 'spades' | 'clubs';
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
  rarity: "common" | "uncommon" | "rare",
  price: number,
  sellValue: number,
  activePhase: string,
  description: string
}

export type Tarot = {
  name: TarotTypes,
  cardCount: number, //0, 1, 2, 3
  price: number,
  sellValue: number,
  description: string
}

export type TarotFnResult = {
  deckStatus: DeckStatus,
  runStatus: RunStatus,
  status: string,
}
export type TarotFn = (baseDeck:DeckStatus, baseRun:RunStatus) => TarotFnResult;

export type Planet = {
  name: PlanetTypes,
  chip: number,
  mult: number,
  price: number,
  sellValue: number,
  handType: HandTypes,
  hidden: boolean //for flushFive, other 'secret' planets
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
type SkipTagTypes =  'uncommonJoker' | 'rareJoker' | 'negativeJoker' |
  'foilJoker' | 'holoJoker' | 'polyJoker' |
  'coupon' | 'rerollDiscount' | 'gainTwoJokers' |
  'doubleMoney' | 'handPayoff' | 'discardPayoff' | 'skipPayoff' |
  'celestialPack' | 'jokerPack' | 'tarotPack' | 'spectralPack' |
  'bossReroll' | 'orbital';

export type TarotTypes = 'moon'|'star'|'sun'|'world'|  //suit change for 3
  'magician'|'empress'|'hierophant'|'strength'| //enhance 2
  'lovers'|'chariot'|'justice'|'devil'|'tower'| //enhance 1
  'fool'|'highPriestess'|'emperor'|'judgment'|  //create misc
  'wheelOfFortune'|'hermit'|'temperance'|       //bonus
  'death'|'hangedMan';                          //copy/destroy 2

export type PlanetTypes = 'mercury'| 'venus'| 'earth' | 'mars' |
'jupiter' | 'saturn' | 'neptune' | 'uranus' | 'pluto';


//FIXME: May also want a runSeed or similar
//to handle what shops should carry for each round
//for instance, which vouchers are still to come.
export type RunStatus = {
  jokers: Joker[],

  hands: number,
  discards: number,
  handSize: number,

  currentRound: number,
  currentAnte: number,
  currentMoney: number,
  scoreGoals: number[],
  skipTag: SkipTagTypes | null,

  vouchers: VoucherTypes[],
  inventory: string[], //Tarots, Planets, Spectral Cards
  lastUsed: string | null, //Tarot or Planet
  handRecord: {},
}


export type RoundStatus = {
  handsLeft: number,
  discardsLeft: number,
  scoreForRound: number,
  chip: number,
  mult: number,
}


export type DeckStatus = {
  deck: Card[],
  dealtCards: Card[], //handSize active cards, can be played or discarded.
  selectedCards: boolean[],
  playedCards: Card[],
  unplayedCards: Card[],
  usedCards: Card[], //discarded or played
  remainingCards: Card[], //deck remaining
}
export type CardDeck = {
  deck: Card[],
  dealtCards: Card[], //handSize active cards, can be played or discarded.
  selectedCards: boolean[],
  playedCards: Card[],
  unplayedCards: Card[],
  usedCards: Card[], //discarded or played
  remainingCards: Card[], //deck remaining
}


export type TarotDeck = {
  deck: Tarot[],
  dealtCards: Tarot[],
  selectedCards: boolean[],
}

export type PlanetDeck = {
  deck: Planet[],
  dealtCards: Planet[],
  selectedCards: boolean[],
}

export type ShelfItem = {category: string, item:Joker|Card|Tarot|Planet};
function buildStock(){
  const shelf:ShelfItem[] = [];
  const voucher:VoucherTypes[] = [];
  const pack:Pack[] = [];
  return {shelf, voucher, pack};
}
export type ShopStock = {
  shelf: ShelfItem[],
  vouchers: VoucherTypes[],
  packs: Pack[],
}

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



export type VoucherTypes = 'blank' | 'bossReroll' | 'clearance' | 'consumable' |
  'discardsLeft' | 'handsLeft' | 'handSize' | 'hieroglyph' | 'overstock' |
  'planet' | 'reroll' | 'seedMoney' | 'shopCards' | 'specialCards' |
  'tarot' | 'telescope';


export type Pack = {
  packType: 'planet'|'tarot',
  size: 'normal'|'jumbo'|'mega',
  cardCount: 4|5|6,
  version: 1|2,
};


export type ScoreChange = {
  id: number,
  value: number,
  change: 'chip'|'mult'|'multTimes'
};


export type HandRecord = {
    highCard:       {play: number, level: number},
    pair:           {play: number, level: number},
    threeOf:        {play: number, level: number},
    fourOf:         {play: number, level: number},
    fiveOf:         {play: number, level: number},
    flushFive:      {play: number, level: number},
    twoPair:        {play: number, level: number},
    fullHouse:      {play: number, level: number},
    flushHouse:     {play: number, level: number},
    flush:          {play: number, level: number},
    straight:       {play: number, level: number},
    straightFlush:  {play: number, level: number},
    royalFlush:     {play: number, level: number},
  };