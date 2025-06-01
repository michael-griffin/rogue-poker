//A collection of tarots

//https://balatrogame.fandom.com/wiki/Tarot_Cards


import { Tarot,
  TarotTypes,
  DeckStatus,
  RunStatus,
  RoundStatus,
 } from "../types/misc";

// type TarotFunction = ();
/** Tarot Functions require a deck status (to see dealt/selected cards)
 *
 */
const baseTarot = {
  name: '',
  price: 3,
  sellValue: 1,
  description: '',
};


const lovers:Tarot = {
  ...baseTarot,
  name: 'lovers',
  description: 'enhances 1 selected card into wildcard',
};
function loversFn(deckStatusStart:DeckStatus,
  runStatusStart:RunStatus){

}

const hangedMan:Tarot = {
  name:'hangedMan',
  price: 3,
  sellValue: 1,
  description: 'destroys up to 2 selected cards',
}

function hangedManFn(
  deckStatusStart:DeckStatus,
  runStatusStart:RunStatus
){
  let currentDeck = structuredClone(deckStatusStart);
  let currentRun = structuredClone(runStatusStart);
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

  return {
    currentDeck,
    currentRun,
    status
  }
}



type AllTarotFunctions = {
  [key: string]: Function,
}
export const allTarotFunctions: AllTarotFunctions = {

}

type Tarots = {
  [index: string]: Tarot,
}
export const allTarots:Tarots = {
  lovers,
}

export const allTarotsList = Object.values(allTarots);
