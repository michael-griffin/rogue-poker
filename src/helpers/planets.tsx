//A collection of tarots

//https://balatrogame.fandom.com/wiki/Tarot_Cards

import { HandRecord, HandTypes, Planet, PlanetTypes, PlanetDeck } from "../types/misc";
import { shuffle } from "./misc";

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

export function dealPlanets(baseDeck:PlanetDeck, num: number): PlanetDeck {
  let currentDeck = structuredClone(baseDeck);

  let shuffled = shuffle(currentDeck['deck']);
  let dealtCards = shuffled.slice(0, num);
  let selectedCards = Array(dealtCards.length).fill(false);

  currentDeck['dealtCards'] = dealtCards;
  currentDeck['selectedCards'] = selectedCards;

  return currentDeck;
}




export function buildPlanetDeck():PlanetDeck {
  let planetDeck:PlanetDeck = {
    deck: [],
    dealtCards: [],
    selectedCards: [],
  };

  planetDeck['deck'] = structuredClone(allPlanetsList);
  return planetDeck;
}