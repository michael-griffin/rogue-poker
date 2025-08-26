//TODO: this is pretty unorganized. Current plan is to try and mirror zustand
//and have an 'actions' section that can accomplish most of this.

import {
  RankNum,
  CardType,
  Suit,
  RankName,
  Enhancement,
  SpecialCardMod,
  Seal,
  Card,
  Joker,
  Tarot,
  TarotDeck,
  Planet,
  PlanetDeck,
  Pack,
  VoucherTypes,
  RunStatus,
  RoundStatus,
  ShelfItem,
  ShopStock,
  HandRecord,
  CardDeck,
  TarotFnResult,
} from '../types/misc'
import {baseHandSize, rankNames, chipValues, shopInfo,
  scoreGoals, baseScores, levelUps,
  allEnhancements, allSpecials, allSeals, allVouchers} from './constants';


import {
  buildCardDeck,
  dealCards,
  makeRandomCards,
  //enhanceCard, //TODO: remove all instances of enhanceCard, stick with card[key] = val
  makeStartingCards,
  resetDeck,
} from './cards/cards';

import { allTarotFunctions, allTarotsList, dealTarots } from './cards/tarots';
import { allPlanetsList, dealPlanets, levelUpHand } from './cards/planets';
import { allJokerFunctions, findActiveJokers,
  commonJokersList, uncommonJokersList, rareJokersList,
  uncommonJokers} from "./cards/jokers";






export function finishRound(baseDeck:CardDeck,
  baseRun:RunStatus,
  baseRound:RoundStatus) {

  let currentDeck:CardDeck = structuredClone(baseDeck);
  let currentRun:RunStatus = structuredClone(baseRun);
  let currentRound:RoundStatus = structuredClone(baseRound);

  //reset deck
  let cleanDeck = resetDeck(currentDeck);

  const jokerFns = findActiveJokers(currentRun['jokers'], 'roundEnd');
  //update egg, destroy banana, cash in from cloud9/rocket ship.


  //Update Money
  const moneyForHands = currentRound['handsLeft'];
  const moneyForInterest = Math.floor(currentRun['currentMoney'] / 5);
  currentRun['currentMoney'] += moneyForHands + moneyForInterest;


  //build new roundStatus
  let cleanRoundStats = buildRoundStatus(currentRun['hands'], currentRun['discards']);


  return {
    cardDeck: cleanDeck,
    runStatus: currentRun,
    roundStatus: cleanRoundStats,
  }
}

/** Trickier than it seems. Vouchers can add card/tarot to the shelf */
function stockShop(runStatus:RunStatus){
  const newStock = buildStock();
  //add shelf items
  newStock['shelf'] = restockShelf();

  //add voucher
  let possVouchers = structuredClone(allVouchers);
  let ownedVouchers = runStatus['vouchers'];
  possVouchers = possVouchers.filter(voucher => !ownedVouchers.includes(voucher));
  possVouchers = shuffle(possVouchers);
  newStock['vouchers'].push(possVouchers[0]);


  //add packs
  let possPacks = buildPackVariations();
  possPacks = shuffle(possPacks);
  newStock['packs'].push(possPacks[0]);
  newStock['packs'].push(possPacks[1]);

  return newStock;
}
// stock = {
//   'shelf': [{category: 'joker', item: jokerInst}, ...],
//   'voucher': [VoucherTypes],
//   'pack': [{packType: planet|tarot, size:]
// }
// type ShelfItem = {category: string, item:Joker|Card|Tarot|Planet};
function buildStock(): ShopStock {

  const shelf:ShelfItem[] = [];
  const vouchers:VoucherTypes[] = [];
  const packs:Pack[] = [];
  let newStock:ShopStock = {shelf, vouchers, packs};
  return newStock;
}

//TODO: currently missing special edition implementation.
function restockShelf(){
  let newShelf:ShelfItem[] = [];
  let possItems = [];
  let possRarities = [];
  const {shelfRates, jokerRates} = shopInfo;
  for (let [category, quantity] of Object.entries(shelfRates)){
    for (let i = 0; i < quantity; i++){
      possItems.push(category);
    }
  }
  for (let [rarity, quantity] of Object.entries(jokerRates)){
    for (let i = 0; i < quantity; i++){
      possRarities.push(rarity);
    }
  }

  possItems = shuffle(possItems);
  possRarities = shuffle(possRarities);

  let planets = shuffle(allPlanetsList);
  let tarots = shuffle(allTarotsList);
  let commonJokers = shuffle(commonJokersList);
  let uncommonJokers = shuffle(uncommonJokersList);
  let rareJokers = shuffle(rareJokersList);
  for (let i = 0; i < 2; i++){ //TODO: increase to 4 to handle overstock voucher.
    let category = possItems[i];
    let nextItem:Planet|Tarot|Joker|Card; //TODO: add card.

    if (category === 'planet'){
      nextItem = planets[i];
    } else if (category === 'tarot'){
      nextItem = tarots[i];
    } else { // if (category === 'joker'){
      let rarity = possRarities[i];
      if (rarity === 'common'){
        nextItem = commonJokers[i];
      } else if (rarity === 'uncommon'){
        nextItem = uncommonJokers[i];
      } else { //if (rarity === 'rare'){
        nextItem = rareJokers[i];
      }
      possRarities = shuffle(possRarities);
    }

    newShelf.push({category, item: nextItem});
  }


  return newShelf;
}
function buildPackVariations(){
  let packs:Pack[] = [];
  let packTypes = ['planet', 'tarot'];
  let sizes = ['normal', 'jumbo', 'mega'];
  let cardCounts = {'normal': 4, 'jumbo': 5, 'mega': 6};
  let versions = [1, 2];

  for (let packType of packTypes){
    for (let size of sizes){
      let cardCount = cardCounts[size as 'normal'|'jumbo'|'mega'];
      for (let version of versions){
        let newPack = {packType, size, cardCount, version} as Pack;
        packs.push(newPack);
      }
    }
  }

  return packs;
}
// function buyItem(stock, category:'shelf'|'voucher'|'pack', ind=0){

// }

/**
 * Opens pack,
 * selects appropriate tarot/playing/planet cards.
 *
 * Should have a parameter to switch select instructions between auto/manual.
 * @param pack
 * @param baseDeck
 * @param baseRun
 * @returns
 */
function usePack(pack:Pack, baseDeck:CardDeck, baseRun:RunStatus,
  selectInstructions='simple'){

  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  let {packType, cardCount} = pack;

  let result;
  if (packType === 'planet'){
    const planetDeck = openPlanetPack(pack);

    //select planet

    //call function to return new handRecord
    //update runStatus with new handRecord

  } else if (packType === 'tarot'){
    let tarotDeck = openTarotPack(pack) as TarotDeck;

    //select tarot
    let tarotInd:number[] = handleSelection(selectInstructions, 1, cardCount);



    tarotDeck = selectTarots(tarotDeck, tarotInd);
    let tarotChosen = tarotDeck['dealtCards'][tarotInd[0]];
    const cardsNeeded = tarotChosen['cardCount'];
    //select cards
    let cardInd = handleSelection(selectInstructions,
      cardsNeeded, currentRun['handSize']);

    currentDeck = selectCards(currentDeck, cardInd);

    //call tarot function that updates cardDeck or runStatus

    // currentDeck = result['cardDeck'];
    // currentRun = result['runStatus'];
  } else if (packType === 'card'){

  }

  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
  }
}

function openCardPack(pack:Pack){
  let {cardCount, packType} = pack;
  if (packType !== 'card') throw new Error('incorrect pack passed');

  let cardDeck = buildCardDeck();
  const randomCards = makeRandomCards();
  cardDeck['deck'] = randomCards;

  cardDeck = dealCards(cardDeck, cardCount);
  return cardDeck;
}


function openPlanetPack(pack:Pack){
  let {cardCount, packType} = pack;
  if (packType !== 'planet') throw new Error('incorrect pack passed');

  const planetDeck = dealPlanets(cardCount);
  return planetDeck;
}

/** expects a planetDeck with dealt + selected prefilled, and a runStatus.
 * returns a new runStatus, with handRecord updated.
 */
function usePlanet(planetDeck:PlanetDeck, baseRun:RunStatus){
  let newRun = structuredClone(baseRun);

  const selection = planetDeck['dealtCards'].filter((_, ind) => {
    return planetDeck.selectedCards[ind];
  });
  if (selection.length != 1) throw new Error('invalid planet selection');

  const handToLevel = selection[0].handType;
  let newHandRecord = levelUpHand(baseRun['handRecord'] as HandRecord, handToLevel);
  newRun['handRecord'] = newHandRecord;

  return newRun;
}

/** Creates a tarot deck, deals cards matching packSize, and builds an empty
 * selectCards array */
function openTarotPack(pack:Pack){
  let {cardCount, packType} = pack;
  if (packType !== 'tarot') throw new Error('incorrect pack passed');

  const tarotDeck = dealTarots(cardCount); //deals tarot cards, sets up select
  return tarotDeck;
}


/** Inputs: a tarotDeck with 1 selection made, a cardDeck with
 * cards selected for the tarot to modify (see tarot['cardCount'])
 * and runStatus.
 * Finds the selected tarot + its function, then calls that function
 * with cardDeck + runStatus to modify both.
 */
function useTarot(
  tarotDeck:TarotDeck,
  baseDeck:CardDeck,
  baseRun:RunStatus
): TarotFnResult {
  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  const selection = tarotDeck['dealtCards'].filter((_, ind) => {
    return tarotDeck.selectedCards[ind];
  });
  if (selection.length != 1) throw new Error('invalid tarot selection');

  //TODO: may be worth checking if currentDeck has card
  //selections in place prior to tarotFn call.

  const tarotName = selection[0]['name'];
  const tarotFn = allTarotFunctions[tarotName];
  let tarotResult = tarotFn(currentDeck, currentRun);
  return tarotResult;
}
// function openTarotPack(pack:Pack, baseDeck:CardDeck,
//   baseRun:RunStatus){
//   let {size:sizeName, packType} = pack;
//   if (packType !== 'tarot') throw new Error('incorrect pack passed');

//   let packSizes = {'normal': 4, 'jumbo': 5, 'mega': 6};
//   let packSize = packSizes[sizeName];

//   let currentDeck:CardDeck = structuredClone(baseDeck);
//   let currentRun:RunStatus = structuredClone(baseRun);

//   let dealtTarots = dealTarots(packSize);
//   let selectedTarot = Array(packSize).fill(false);

//   //select tarot
//   let tarotChoices = chooseRandom(1, dealtTarots.length);
//   let tarotChoice = dealtTarots[tarotChoices[0]];
//   let selectCount = tarotChoice.cardCount;

//   //select cards
//   currentDeck = dealCards(currentDeck, baseHandSize);
//   let cardChoices = chooseRandom(selectCount, currentDeck['dealtCards'].length);
//   currentDeck = selectCards(currentDeck, cardChoices);

//   //use Tarot
//   const tarotFn = allTarotFunctions[tarotChoice['name']];
//   let tarotResult = tarotFn(currentDeck, currentRun);

//   return {
//     cardDeck: tarotResult['cardDeck'],
//     runStatus: tarotResult['runStatus'],
//   }
// }




export function buildRunStatus(
  difficulty: 'normal'|'hard'|'hell'='normal',
  hands=4, discards=3, startMoney=4,
  handSize=baseHandSize
): RunStatus {

  const newStatus = {
    jokers: [],
    hands,
    discards,
    handSize,

    currentRound: 1,
    currentAnte: 1,
    currentMoney: startMoney,
    scoreGoals: scoreGoals[difficulty],
    skipTag: null,

    vouchers: [],
    inventory: [],
    lastUsed: null,
    handRecord: buildHandRecord(),
  }

  return newStatus;
}


export function buildRoundStatus(handsLeft=4, discardsLeft=3): RoundStatus {
  const newStatus = {
    handsLeft,
    discardsLeft,
    scoreForRound: 0,
    chip: 0,
    mult: 0,
  }

  return newStatus;
}



export function buildHandRecord(){
  const handRecord = {
    highCard:       {play: 0, level: 0},
    pair:           {play: 0, level: 0},
    threeOf:        {play: 0, level: 0},
    fourOf:         {play: 0, level: 0},
    fiveOf:         {play: 0, level: 0},
    flushFive:      {play: 0, level: 0},
    twoPair:        {play: 0, level: 0},
    fullHouse:      {play: 0, level: 0},
    flushHouse:     {play: 0, level: 0},
    flush:          {play: 0, level: 0},
    straight:       {play: 0, level: 0},
    straightFlush:  {play: 0, level: 0},
    royalFlush:     {play: 0, level: 0},
  };

  return handRecord;
}


export function handleSelection(instructions='simple', count=1, maxSize=baseHandSize){
  let selectInds:number[]=[];
  if (instructions === 'simple'){
    selectInds = chooseSimple(count, maxSize);
  } else if (instructions === 'random'){
    selectInds = chooseSimple(count, maxSize);
  } else if (instructions === 'manual'){

  }

  return selectInds;
}
/** Returns an array with [count] random indices.
 * Indices are between 0 and maxSize, exclusive*/
export function chooseRandom(count:number, maxSize:number=baseHandSize){
  let allIndices = Array(maxSize).fill(-1).map((_, ind) => ind);
  let indices = shuffle(allIndices).slice(0,count);
  return indices;
}
/** Returns an array with [count] indices, counting up from 0.*/
export function chooseSimple(count:number, maxSize:number=baseHandSize){
  let allIndices = Array(maxSize).fill(-1).map((_, ind) => ind);
  let indices = allIndices.slice(0, count);
  return indices;
}

/** Given an array, returns a random element */
export function pickRandom(base:any[]){
  let arr = structuredClone(base);
  let choice = Math.floor(Math.random() * arr.length);
  return arr[choice];
}

/** Given an array, returns a new array with shuffled contents */
export function shuffle(base:any[]) {
  let arr = structuredClone(base);
  for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
  }
  return base;
}