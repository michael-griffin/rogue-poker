import { Enhancement, Seal, SpecialCardMod, VoucherTypes } from "../types/misc";

export const scoreGoals = {
  normal: [100, 300, 800, 2000, 5000, 11000, 20000, 35000, 50000],
  hard: [100, 300, 900, 2600, 8000, 20000, 36000, 60000, 100000],
  hell: [100, 300, 1000, 3200, 9000, 25000, 60000, 110000, 200000],
}
export const baseHandSize = 8;

export const shopInfo = {
  shelfRates: {
    'joker': 20,
    'planet': 4,
    'tarot': 4,
    //card: 0, spectral, 0.
  },
  jokerRates: {
    'common': 15,
    'uncommon': 5,
    'rare': 2,
  },
  prices: {
    card: 1,
    planet: 3,
    tarot: 3,
    normal: 4,
    jumbo: 6,
    mega: 8,
    voucher: 10,
  },
  sellPrices: {
    planet: 1,
    tarot: 1,
  },
  cardUpgradeRates: {
    enhanced: 10,
    special: 5,
    seal: 2,
  },
  upgradeChance: .2,
};
// export type Enhancement = "bonus" | "mult" | "wild" | "glass" | "steel" |
//   "stone" | "gold" | "lucky";
// export type SpecialCardMod = "foil" | "holo" | "poly";
// type SpecialJokerMod = SpecialCardMod;
// export type Seal = "red" | "blue" | "purple" | "gold";
export const allEnhancements: Enhancement[] = [
  'bonus', 'glass', 'gold', 'lucky', 'mult', 'steel', 'stone', 'wild'
];
export const allSpecials: SpecialCardMod[] = ['foil', 'holo', 'poly'];
export const allSeals: Seal[] = ['blue', 'gold', 'purple', 'red'];

//excluding:
//bossReroll, hieroglyph, 'planet', tarot, 'telescope', 'shopCards', 'specialCards'
export const allVouchers: VoucherTypes[] = ['clearance', 'consumable',
  'discardsLeft', 'handsLeft', 'handSize',  'overstock', 'reroll', 'seedMoney'];

// //excluding standard(card), spectral
// export const allPackTypes = ['planet','tarot'];
// export const allPackSizes = ['normal','jumbo','mega'];



export const baseScores = {
  'highCard':       {'chip': 5,   'mult': 1},
  'pair':           {'chip': 10,  'mult': 2},
  'threeOf':        {'chip': 30,  'mult': 3},
  'fourOf':         {'chip': 60,  'mult': 7},
  'fiveOf':         {'chip': 120, 'mult': 12},
  'flushFive':      {'chip': 160, 'mult': 16},
  'twoPair':        {'chip': 20,  'mult': 2},
  'fullHouse':      {'chip': 40,  'mult': 4},
  'flushHouse':     {'chip': 140, 'mult': 14},
  'flush':          {'chip': 35,  'mult': 4},
  'straight':       {'chip': 30,  'mult': 4},
  'straightFlush':  {'chip': 100, 'mult': 8},
  'royalFlush':     {'chip': 100, 'mult': 8},
}

export const levelUps = {
  'highCard':       {'chip': 10, 'mult': 1},
  'pair':           {'chip': 15, 'mult': 1},
  'threeOf':        {'chip': 20, 'mult': 2},
  'fourOf':         {'chip': 30, 'mult': 3},
  'fiveOf':         {'chip': 35, 'mult': 3},
  'flushFive':      {'chip': 50, 'mult': 3},
  'twoPair':        {'chip': 20, 'mult': 1},
  'fullHouse':      {'chip': 25, 'mult': 2},
  'flushHouse':     {'chip': 40, 'mult': 4},
  'flush':          {'chip': 15, 'mult': 2},
  'straight':       {'chip': 30, 'mult': 3},
  'straightFlush':  {'chip': 40, 'mult': 4},
  'royalFlush':     {'chip': 40, 'mult': 4},
}

export const rankNames = {
  1: 'ace',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'jack',
  12: 'queen',
  13: 'king'
};

export const chipValues = {
  1: 11,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 10,
  12: 10,
  13: 10
};

export const packSizes = {
  'normal': 4,
  'jumbo': 5,
  'mega': 6,
}