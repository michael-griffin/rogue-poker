//A collection of jokers.
import {Joker} from "../types/misc.tsx";
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

//A collection of joker functions. During
//a phase when a joker would be active, the joker name
//is used as a key to find the effect the joker has
export const allJokerFunctions = {
  'slyJoker': slyJokerFn,
  'lustyJoker': lustyJokerFn,
  'smileyFace': smileyFaceFn,
}


export const slyJoker: Joker = {
  name: 'slyJoker',
  special: null,
  negative: false,
  price: 3,
  sellValue: 1,
  activePhase: 'jokerScore',
  description: 'if hand contained a pair, +50 chip',
};

export const lustyJoker: Joker = {
  name: 'lustyJoker',
  special: null,
  negative: false,
  price: 5,
  sellValue: 2,
  activePhase: 'handScore',
  description: 'played hearts give +3 mult',
};

export const smileyFace: Joker = {
  name: 'smileyFace',
  special: null,
  negative: false,
  price: 4,
  sellValue: 2,
  activePhase: 'handScore',
  description: 'played face cards give +5 mult',
};
