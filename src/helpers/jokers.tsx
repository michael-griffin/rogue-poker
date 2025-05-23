//A collection of jokers.
import {Joker, Card, HandStatus} from "../types/misc.tsx";
//Jokers
/*
export type Joker = {
  name: string,
  special: SpecialJokerMod | null, //holo, foil, poly
  negative: boolean,
  price: number,
  sellValue: number,
  activePhase: string,
  description: string,
}
*/



/*******************/
/** COMMON JOKERS **/
/*******************/


export const slyJoker: Joker = {
  name: 'slyJoker',
  special: null,
  negative: false,
  rarity: 'common',
  price: 3,
  sellValue: 1,
  activePhase: 'scoreJokers',
  description: 'if hand contained a pair, +50 chip',
};
function slyJokerFn(hand: Card[]){

  return {
    chip: 50,
    mult: 0,
    multTimes: 0,
  }
}


export const lustyJoker: Joker = {
  name: 'lustyJoker',
  special: null,
  negative: false,
  rarity: 'common',
  price: 5,
  sellValue: 2,
  activePhase: 'scorePlayed',
  description: 'played hearts give +3 mult',
};
function lustyJokerFn(card: Card){

  return {
    chip: 0,
    mult: 3,
    multTimes: 0,
  }
}


export const smileyFace: Joker = {
  name: 'smileyFace',
  special: null,
  negative: false,
  rarity: 'common',
  price: 4,
  sellValue: 2,
  activePhase: 'scorePlayed',
  description: 'played face cards give +5 mult',
};
function smileyFaceFn(card: Card){
  let bonus = {
    chip: 0,
    mult: 0,
    multTimes: 0,
  }

  if (card.cardType === 'face') bonus.mult = 5;
  return bonus;
}

/*********************/
/** UNCOMMON JOKERS **/
/*********************/

export const bloodstone: Joker = {
  name: 'bloodstone',
  special: null,
  negative: false,
  rarity: 'uncommon',
  price: 7,
  sellValue: 3,
  activePhase: 'scorePlayed',
  description: 'played hearts give 50% chance of x1.5 mult',
};
function bloodstoneFn(card: Card){
  let bonus = {
    chip: 0,
    mult: 0,
    multTimes: 0,
  }

  if (card.suit === 'hearts') {
    let chance = Math.round(Math.random());
    if (chance) bonus.multTimes = 1.5;
  }
}


export const arrowhead: Joker = {
  name: 'arrowhead',
  special: null,
  negative: false,
  rarity: 'uncommon',
  price: 7,
  sellValue: 3,
  activePhase: 'scorePlayed',
  description: 'played spades give +50 chips',
};
function arrowheadFn(card: Card){
  let bonus = {
    chip: 0,
    mult: 0,
    multTimes: 0,
  }

  if (card.suit === 'spades') bonus.chip = 50;
  return bonus;
}


/*****************/
/** RARE JOKERS **/
/*****************/

export const theDuo: Joker = {
  name: 'theDuo',
  special: null,
  negative: false,
  rarity: 'rare',
  price: 8,
  sellValue: 4,
  activePhase: 'scorePlayed', //FIXME: activePhase is wrong
  description: 'x2 mult if played hand contains pair',
};
function theDuoFn(handStatus: HandStatus){
  let bonus = {
    chip: 0,
    mult: 0,
    multTimes: 0,
  }

  if (handStatus.handTypes.includes('pair')) bonus.multTimes = 2;
  return bonus;
}


export const theTrio: Joker = {
  name: 'theTrio',
  special: null,
  negative: false,
  rarity: 'rare',
  price: 8,
  sellValue: 4,
  activePhase: 'scorePlayed', //FIXME: activePhase is wrong
  description: 'x3 mult if played hand contains pair',
};
function theTrioFn(handStatus: HandStatus){
  let bonus = {
    chip: 0,
    mult: 0,
    multTimes: 0,
  }

  if (handStatus.handTypes.includes('threeOf')) bonus.multTimes = 3;
  return bonus;
}

/*****************/
/** COLLECTIONS **/
/*****************/

//A collection of joker functions. During a phase when a joker would
//be active, the joker name is used as a key to find the effect
type AllJokerFunctions = {
  [key: string]: Function,
}
export const allJokerFunctions: AllJokerFunctions = {
  'slyJoker': slyJokerFn,
  'lustyJoker': lustyJokerFn,
  'smileyFace': smileyFaceFn,
  'bloodstone': bloodstoneFn,
  'arrowhead': arrowheadFn,
  'theDuo': theDuoFn,
  'theTrio': theTrioFn,

}

type Jokers = {
  [index: string]: Joker,
}
export const allJokers:Jokers = {
  slyJoker,
  lustyJoker,
  smileyFace,
  bloodstone,
  arrowhead,
  theDuo,
  theTrio,
}


function filterJokers(jokers: Jokers, rarity: 'common'|'uncommon'|'rare'){
  const filtered:Jokers = {};

  let keyVals = Object.entries(jokers);
  for (let i = 0; i < keyVals.length; i++){
    let [jokerName, joker] = keyVals[i];
    if (joker.rarity === rarity) filtered[jokerName] = joker;
  }

  return filtered;
}

export const commonJokers = filterJokers(allJokers, 'common');
export const uncommonJokers = filterJokers(allJokers, 'uncommon');
export const rareJokers = filterJokers(allJokers, 'rare');
