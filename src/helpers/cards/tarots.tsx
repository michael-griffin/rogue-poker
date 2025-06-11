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
    runStatus: currentRun,
    deckStatus: currentDeck,
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
  lovers: loversFn,
}

type Tarots = {
  [index: string]: Tarot,
}
export const allTarots:Tarots = {
  lovers,
}

export const allTarotsList:Tarot[] = Object.values(allTarots);

//FIXME: dealTarots should be updated to return a tarotDeck
export function dealTarots(num: number): Tarot[] {
  let shuffled = shuffle(allTarotsList);
  let dealt = shuffled.slice(0, num);
  return dealt;
}


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

export const selectTarots = selectCards;
export const unselectAllTarots = unselectAllCards;

const tarotDeckFns = {
  dealTarots,
  selectTarots, //selectCards
  unselectAllTarots, //unselectAllCards
  buildTarotDeck,
  resetTarotDeck,
}