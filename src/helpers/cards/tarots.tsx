//A collection of tarots

//https://balatrogame.fandom.com/wiki/Tarot_Cards

import {shuffle} from '../actions/misc';

import { Tarot,
  TarotDeck,
  RunStatus,
  TarotFn,
  TarotFnResult,
  CardDeck,
} from "../../types/misc";

import { selectCards, unselectAllCards } from './cards';

// type TarotTypes = 'moon'|'star'|'sun'|'world'|  //suit change for 3
//   'magician'|'empress'|'hierophant'|'strength'| //enhance 2
//   'lovers'|'chariot'|'justice'|'devil'|'tower'| //enhance 1
//   'fool'|'highPriestess'|'emperor'|'judgment'|  //create misc
//   'wheelOfFortune'|'hermit'|'temperance'|       //bonus
//   'death'|'hangedMan';

// type TarotFunction = ();
/** Tarot Functions require a deck status (to see dealt/selected cards)
 *
 */
const baseTarot = {
  name: '',
  cardsUsed: [0], //how many cards should be selected to use Tarot
  price: 3,
  sellValue: 1,
  description: '',
};

/** Wrapper for calling tarot functions, confirms
 * cardCounts are correct, then calls relevant TarotFn.
 * returns success status, and updated deck + runStatus */
export function useTarot(baseDeck:CardDeck, baseRun:RunStatus,
  tarotCard:Tarot): TarotFnResult {

  let selectedCount = baseDeck.selectedCards.reduce((totalCount, selected) => {
    if (selected) totalCount++;
    return totalCount;
  }, 0);
  if (!tarotCard.cardsUsed.includes(selectedCount)) {
    return {cardDeck: baseDeck, runStatus: baseRun, status: 'invalid'};
  }

  //call specific Tarot function
  const TarotFn = allTarotFunctions[tarotCard['name']];
  let result = TarotFn(baseDeck, baseRun);
  let {cardDeck, runStatus, status} = result;

  return {
    cardDeck,
    runStatus,
    status,
  }
}

/** Enhance 3 Tarots */
//'moon'|'star'|'sun'|'world'|
const moon:Tarot = {
  ...baseTarot,
  name: 'moon',
  description: "converts up to 3 cards' suits to clubs",
  cardsUsed: [1,2,3],
}
function moonFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]) currentDeck['dealtCards'][i].suit = 'clubs';
  };
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const star:Tarot = {
  ...baseTarot,
  name: 'star',
  description: "converts up to 3 cards' suits to diamonds",
  cardsUsed: [1,2,3],
}
function starFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]) currentDeck['dealtCards'][i].suit = 'diamonds';
  };
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const sun:Tarot = {
  ...baseTarot,
  name: 'sun',
  description: "converts up to 3 cards' suits to hearts",
  cardsUsed: [1,2,3],
}
function sunFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]) currentDeck['dealtCards'][i].suit = 'hearts';
  };
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const world:Tarot = {
  ...baseTarot,
  name: 'world',
  description: "converts up to 3 cards' suits to spades",
  cardsUsed: [1,2,3],
}
function worldFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]) currentDeck['dealtCards'][i].suit = 'spades';
  };
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}


/** Enhance 2 Tarots */
//'magician'|'empress'|'hierophant'|'strength'|
const magician:Tarot = {
  ...baseTarot,
  name: 'magician',
  description: 'enhances up to 2 selected cards into lucky cards',
  cardsUsed: [1,2],
}
function magicianFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]) currentDeck['dealtCards'][i].enhanced = 'lucky';
  };
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const empress:Tarot = {
  ...baseTarot,
  name: 'empress',
  description: 'enhances up to 2 selected cards into lucky cards',
  cardsUsed: [1,2],
}
function empressFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]) currentDeck['dealtCards'][i].enhanced = 'mult';
  };
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const hierophant:Tarot = {
  ...baseTarot,
  name: 'hierophant',
  description: 'enhances up to 2 selected cards into bonus chip cards',
  cardsUsed: [1, 2],
}
function hierophantFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]) currentDeck['dealtCards'][i].enhanced = 'bonus';
  };
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const strength:Tarot = {
  ...baseTarot,
  name: 'strength',
  description: "increases up to 2 selected cards' ranks by 1",
  cardsUsed: [1, 2],
}
function strengthFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]) {
      if (currentDeck['dealtCards'][i].rank === 13){
        currentDeck['dealtCards'][i].rank = 1; //king to ace
      } else {
        currentDeck['dealtCards'][i].rank += 1;
      }
    }
  };
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}


/** Enhance 1 Tarots */
//   'lovers'|'chariot'|'justice'|'devil'|'tower'|
const lovers:Tarot = {
  ...baseTarot,
  name: 'lovers',
  description: 'enhances 1 selected card into wildcard',
  cardsUsed: [1],
};
function loversFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  //modify card(s)
  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]) currentDeck['dealtCards'][i].enhanced = 'wild';
  }
  //unselect all
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const chariot:Tarot = {
  ...baseTarot,
  name: 'chariot',
  description: 'enhances 1 selected card into steel',
  cardsUsed: [1],
};
function chariotFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  //modify card(s)
  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]) currentDeck['dealtCards'][i].enhanced = 'steel';
  }
  //unselect all
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const justice:Tarot = {
  ...baseTarot,
  name: 'justice',
  description: 'enhances 1 selected card into glass',
  cardsUsed: [1],
};
function justiceFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  //modify card(s)
  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]) currentDeck['dealtCards'][i].enhanced = 'glass';
  }
  //unselect all
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const devil:Tarot = {
  ...baseTarot,
  name: 'devil',
  description: 'enhances 1 selected card into gold',
  cardsUsed: [1],
};
function devilFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  //modify card(s)
  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]) currentDeck['dealtCards'][i].enhanced = 'gold';
  }
  //unselect all
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const tower:Tarot = {
  ...baseTarot,
  name: 'tower',
  description: 'enhances 1 selected card into stone',
  cardsUsed: [1],
};
function towerFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  //modify card(s)
  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]) currentDeck['dealtCards'][i].enhanced = 'stone';
  }
  //unselect all
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}

/** Create Misc Tarots */
//   'fool'|'highPriestess'|'emperor'|'judgment'|



/** Bonuses Tarots */
//   'wheelOfFortune'|'hermit'|'temperance'|       //bonus

const wheelOfFortune:Tarot = {
  ...baseTarot,
  name: 'wheelOfFortune',
  description: '25% chance to upgrade random joker',
  cardsUsed: [0],
};
//FIXME: get wheelOfFortune working
function wheelOfFortuneFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  //TODO: implement pseudo code

  //filter jokers for unmodified
  //check that at least 1 unmodified joker, if none quit early

  //choose random joker, choose random upgrade

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const hermit:Tarot = {
  ...baseTarot,
  name: 'hermit',
  description: 'double money, up to a max of $20',
  cardsUsed: [0],
};
function hermitFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  let bonus = Math.min(currentRun.currentMoney, 20);
  currentRun.currentMoney += bonus;

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const temperance:Tarot = {
  ...baseTarot,
  name: 'temperance',
  description: 'add all jokers sell value to money',
  cardsUsed: [1],
};
function temperanceFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let status = 'success';
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  let jokers = currentRun.jokers;
  let bonus = jokers.reduce((bonus, joker) => {
    let {sellValue} = joker;
    return bonus + sellValue;
  }, 0);

  currentRun.currentMoney += bonus;

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}



const hangedMan:Tarot = {
  ...baseTarot,
  name:'hangedMan',
  description: 'destroys up to 2 selected cards',
  cardsUsed: [1, 2],
}
function hangedManFn(baseDeck:CardDeck,
  baseRun:RunStatus):TarotFnResult {
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);
  let status = 'success';

  //Use tarot (remove cards)
  currentDeck['dealtCards'] = currentDeck['dealtCards'].filter((_, ind) => {
    return !currentDeck['selectedCards'][ind];
  });
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
    status,
  }
}



type AllTarotFunctions = {
  [key: string]: TarotFn,
}
export const allTarotFunctions: AllTarotFunctions = {
  moon: moonFn,
  star: starFn,
  sun: sunFn,
  world: worldFn,
  magician: magicianFn,
  empress: empressFn,
  hierophant: hierophantFn,
  strength: strengthFn,
  lovers: loversFn,
  chariot: chariotFn,
  justice: justiceFn,
  devil: devilFn,
  tower: towerFn,
  hangedMan: hangedManFn,
}

type Tarots = {
  [index: string]: Tarot,
}
export const allTarots:Tarots = {
  moon,
  star,
  sun,
  world,
  magician,
  empress,
  hierophant,
  strength,
  lovers,
  chariot,
  justice,
  devil,
  tower,
  hangedMan,
}
export const allTarotsList:Tarot[] = Object.values(allTarots);






export const baseTarotDeck = buildTarotDeck();
export function buildTarotDeck():TarotDeck {
  let tarotDeck:TarotDeck = {
    deck: [],
    dealtCards: [],
    selectedCards: [],
  };

  tarotDeck['deck'] = structuredClone(allTarotsList);
  return tarotDeck;
}

export function resetTarotDeck(baseDeck:TarotDeck=baseTarotDeck){
  let reset = structuredClone(baseDeck);
  reset['dealtCards'] = [];
  reset['selectedCards'] = [];
  return reset;
}

export function dealTarots(num: number, baseDeck=baseTarotDeck): TarotDeck {
  let newDeck = structuredClone(baseDeck);
  let shuffled = shuffle(newDeck['deck']);
  let dealt = shuffled.slice(0, num);
  newDeck['dealtCards'] = dealt;
  newDeck['selectedCards'] = Array(dealt.length).fill(false);

  return newDeck;
}
export const selectTarots = selectCards;
export const unselectAllTarots = unselectAllCards;

export const tarotDeckFns = {
  dealTarots,
  selectTarots, //selectCards
  unselectAllTarots, //unselectAllCards
  buildTarotDeck,
  resetTarotDeck,
}