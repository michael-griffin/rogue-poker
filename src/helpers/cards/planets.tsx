//A collection of tarots

//https://balatrogame.fandom.com/wiki/Tarot_Cards

import { Planet, PlanetDeck, RunStatus, HandRecord, HandTypes } from "../../types/misc";
import { shuffle } from "../actions/misc";
import { selectCards, unselectAllCards } from "./cards";

/** Expects a planet card and a runStatus, whose handRecord
 * we'll upgrade */
export function usePlanet(baseRun:RunStatus, planet:Planet){
  let newRun = structuredClone(baseRun);
  const handToLevel = planet['handType'];
  let newHandRecord = levelUpHand(baseRun['handRecord'] as HandRecord, handToLevel);
  newRun['handRecord'] = newHandRecord;

  return newRun;
}
export function levelUpHand(handRecord:HandRecord, handType:HandTypes){
  const updatedRecord = structuredClone(handRecord);
  updatedRecord[handType]['level'] += 1;
  return updatedRecord;
}


const pluto: Planet = {
  name: 'pluto',
  handType: 'highCard',
  price: 3,
  sellValue: 1,
  chip: 10,
  mult: 1,
  hidden: false,
}
const mercury: Planet = {
  name: 'mercury',
  handType: 'pair',
  price: 3,
  sellValue: 1,
  chip: 15,
  mult: 1,
  hidden: false,
}
const uranus: Planet = {
  name: 'uranus',
  handType: 'twoPair',
  price: 3,
  sellValue: 1,
  chip: 20,
  mult: 1,
  hidden: false,
}
const venus: Planet = {
  name: 'venus',
  handType: 'threeOf',
  price: 3,
  sellValue: 1,
  chip: 20,
  mult: 2,
  hidden: false,
}
// type allPlanetFunctions = {
//   [key: string]: Function,
// }
// export const allTarotFunctions: allPlanetFunctions = {

// }

type Planets = {
  [index: string]: Planet,
}
export const allPlanets:Planets = {
  pluto,
  mercury,
  uranus,
  venus,
}

export const allPlanetsList = Object.values(allPlanets);
export const basePlanetDeck = buildPlanetDeck();
export function buildPlanetDeck():PlanetDeck {
  let planetDeck:PlanetDeck = {
    deck: [],
    dealtCards: [],
    selectedCards: [],
  };

  planetDeck['deck'] = structuredClone(allPlanetsList);
  return planetDeck;
}

export function resetPlanetDeck(baseDeck:PlanetDeck=basePlanetDeck){
  let reset = structuredClone(baseDeck);
  reset['dealtCards'] = [];
  reset['selectedCards'] = [];
  return reset;
}

export function dealPlanets(num:number, baseDeck=basePlanetDeck): PlanetDeck {
  let currentDeck = structuredClone(baseDeck);

  let shuffled = shuffle(currentDeck['deck']);
  let dealtCards = shuffled.slice(0, num);
  let selectedCards = Array(dealtCards.length).fill(false);

  currentDeck['dealtCards'] = dealtCards;
  currentDeck['selectedCards'] = selectedCards;

  return currentDeck;
}
export const selectPlanets = selectCards;
export const unselectAllPlanets = unselectAllCards;

const planetDeckFns = {
  usePlanet,
  dealPlanets,
  buildPlanetDeck,
  resetPlanetDeck,
  //selectPlanets, //selectCards
  //unselectAllPlanets, //unselectAllCards
}