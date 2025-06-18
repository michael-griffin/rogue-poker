//A collection of tarots

//https://balatrogame.fandom.com/wiki/Tarot_Cards

import {shuffle} from '../misc';

import { Tarot,
  TarotDeck,
  DeckStatus,
  RunStatus,
  TarotFn,
  TarotFnResult,
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
  cardCount: 0, //how many cards should be selected to use Tarot
  price: 3,
  sellValue: 1,
  description: '',
};

const moon:Tarot = {
  ...baseTarot,
  name: 'moon',
  description: "converts up to 3 cards' suits to clubs",
  cardCount: 3,
}
function moonFn(baseDeck:DeckStatus,
  baseRun:RunStatus):TarotFnResult {
  let status = 'invalid';

  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  let selectedCount = baseDeck.selectedCards.reduce((totalCount, selected) => {
    if (selected) totalCount++;
    return totalCount;
  }, 0);
  if (selectedCount < 1 || selectedCount > moon.cardCount) {
    return {deckStatus: currentDeck, runStatus: currentRun, status};
  }

  //If valid selection, convert selections to clubs
  currentDeck['dealtCards'].map((card, ind) => {
    if (currentDeck['selectedCards'][ind]) card['suit'] = 'clubs';
    return card;
  });

  return {
    deckStatus: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const star:Tarot = {
  ...baseTarot,
  name: 'star',
  description: "converts up to 3 cards' suits to diamonds",
  cardCount: 3,
}
function starFn(baseDeck:DeckStatus,
  baseRun:RunStatus):TarotFnResult {
  let status = 'invalid';

  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  let selectedCount = baseDeck.selectedCards.reduce((totalCount, selected) => {
    if (selected) totalCount++;
    return totalCount;
  }, 0);
  if (selectedCount < 1 || selectedCount > moon.cardCount) {
    return {deckStatus: currentDeck, runStatus: currentRun, status};
  }

  //If valid selection, convert selections to clubs
  currentDeck['dealtCards'].map((card, ind) => {
    if (currentDeck['selectedCards'][ind]) card['suit'] = 'diamonds';
    return card;
  });

  return {
    deckStatus: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const sun:Tarot = {
  ...baseTarot,
  name: 'sun',
  description: "converts up to 3 cards' suits to hearts",
  cardCount: 3,
}
function sunFn(baseDeck:DeckStatus,
  baseRun:RunStatus):TarotFnResult {
  let status = 'invalid';

  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  let selectedCount = baseDeck.selectedCards.reduce((totalCount, selected) => {
    if (selected) totalCount++;
    return totalCount;
  }, 0);
  if (selectedCount < 1 || selectedCount > moon.cardCount) {
    return {deckStatus: currentDeck, runStatus: currentRun, status};
  }

  //If valid selection, convert selections to clubs
  currentDeck['dealtCards'].map((card, ind) => {
    if (currentDeck['selectedCards'][ind]) card['suit'] = 'hearts';
    return card;
  });

  return {
    deckStatus: currentDeck,
    runStatus: currentRun,
    status,
  }
}
const world:Tarot = {
  ...baseTarot,
  name: 'world',
  description: "converts up to 3 cards' suits to spades",
  cardCount: 3,
}
function worldFn(baseDeck:DeckStatus,
  baseRun:RunStatus):TarotFnResult {
  let status = 'invalid';

  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  let selectedCount = baseDeck.selectedCards.reduce((totalCount, selected) => {
    if (selected) totalCount++;
    return totalCount;
  }, 0);
  if (selectedCount < 1 || selectedCount > moon.cardCount) {
    return {deckStatus: currentDeck, runStatus: currentRun, status};
  }

  //If valid selection, convert selections to clubs
  currentDeck['dealtCards'].map((card, ind) => {
    if (currentDeck['selectedCards'][ind]) card['suit'] = 'spades';
    return card;
  });

  return {
    deckStatus: currentDeck,
    runStatus: currentRun,
    status,
  }
}



const lovers:Tarot = {
  ...baseTarot,
  name: 'lovers',
  description: 'enhances 1 selected card into wildcard',
  cardCount: 1,
};
function loversFn(baseDeck:DeckStatus,
  baseRun:RunStatus):TarotFnResult {
  let status = 'invalid';

  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  //check whether valid selection
  const selectCount = currentDeck['selectedCards'].reduce((count, selected) => {
    if (selected) count += 1;
    return count;
  }, 0);
  if (selectCount !== lovers['cardCount']){
    return {deckStatus: currentDeck, runStatus: currentRun, status};
  } else {
    status = 'success';
  }

  //modify card(s)
  for (let i = 0; i < currentDeck['dealtCards'].length; i++){
    if (currentDeck['selectedCards'][i]){
      currentDeck['dealtCards'][i].enhanced = 'wild';
    }
  }

  //unselect all
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  return {
    deckStatus: currentDeck,
    runStatus: currentRun,
    status,
  }
}



const hangedMan:Tarot = {
  name:'hangedMan',
  cardCount: 2,
  price: 3,
  sellValue: 1,
  description: 'destroys up to 2 selected cards',
}
function hangedManFn(
  baseDeck:DeckStatus,
  baseRun:RunStatus
):TarotFnResult {
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);
  let status = 'invalid';

  //Check if tarot can be used
  let selectedCount = currentDeck.selectedCards.reduce(
    (count, selected) => selected ? count + 1: count,  0);

  if (selectedCount === 0 || selectedCount > 2){
    return {deckStatus: currentDeck, runStatus: currentRun, status};
  }

  //Use tarot (remove cards)
  currentDeck['dealtCards'] = currentDeck['dealtCards'].filter((_, ind) => {
    return !currentDeck['selectedCards'][ind];
  });
  currentDeck['selectedCards'] = Array(currentDeck['dealtCards'].length).fill(false);

  status = 'success';
  return {
    deckStatus: currentDeck,
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
  lovers: loversFn,
}

type Tarots = {
  [index: string]: Tarot,
}
export const allTarots:Tarots = {
  moon,
  star,
  sun,
  world,
  lovers,
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

const tarotDeckFns = {
  dealTarots,
  selectTarots, //selectCards
  unselectAllTarots, //unselectAllCards
  buildTarotDeck,
  resetTarotDeck,
}