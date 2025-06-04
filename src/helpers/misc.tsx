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
  Planet,
  Pack,
  VoucherTypes,
  DeckStatus,
  RunStatus,
  RoundStatus,
} from '../types/misc'

import { allJokerFunctions,
  commonJokersList, uncommonJokersList, rareJokersList,
  uncommonJokers} from "./jokers";
import {baseHandSize, rankNames, chipValues, shopInfo, allVouchers,
  scoreGoals, baseScores, levelUps} from './constants';
import { allTarotFunctions, allTarotsList, dealTarots } from './tarots';
import { allPlanetsList } from './planets';


//type RankNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
type RankInfo = {
  rank: RankNum,
  name: string,
  chip: number,
  cardType: CardType,
}

export function getRankInfo(rank: RankNum): RankInfo {
  let cardType: CardType;
  if (rank === 1){
    cardType = 'ace';
  } else if (rank > 10){
    cardType = 'face';
  } else {
    cardType = 'number';
  }

  let rankInfo = {
    rank: rank,
    name: rankNames[rank],
    chip: chipValues[rank],
    cardType: cardType,
  }
  return rankInfo;
}


export function makeCard(rank: RankNum, suit:Suit): Card {
  const rankInfo = getRankInfo(rank);
  const name = rankInfo['name'] as RankName;
  const chip = rankInfo['chip'] as number;
  const cardType = rankInfo['cardType'] as CardType;

  const card = {
    suit,
    rank,
    name,
    cardType,
    chip,
    enhanced: null,
    special: null,
    seal: null,
  }
  return card;
}


/** Enhance a card. Updates enhancement, special, or seal property,
 * while leaving other existing properties alone.*/
/*
type EnhanceCardParams = {
  card: Card,
  enhanced: Enhancement | null,
  special: SpecialCardMod | null,
  seal: Seal | null,
}
*/
export function enhanceCard(
  card: Card,
  enhanced=null as Enhancement | null,
  special=null as SpecialCardMod | null,
  seal=null as Seal | null
): Card {

  if (enhanced !== null) card['enhanced'] = enhanced;
  if (special !== null) card['special'] = special;
  if (seal !== null) card['seal'] = seal;

  return card;
}


// export function getCardValue(card: Card){
//   let cardValue = {
//     chip: 0,
//     mult: 0,
//     multTimes: 0,
//   };

//   cardValue['chip'] = card.chip;
//   if (card.enhanced === 'bonus') cardValue['chip'] += 30;
//   if (card.enhanced === 'stone') cardValue['chip'] = 50;

//   if (card.enhan)
//   return {

//   }
// }

export function buildDeckStatus(deck: Card[]=[]): DeckStatus {
  if (deck.length === 0){
    deck = buildStartDeck();
  }

  const deckStatusTemplate = {
    deck: structuredClone(deck), //when moving to react, need to avoid mutating.
    dealtCards: [], //handSize active cards, can be played or discarded.
    selectedCards: [],
    playedCards: [],
    unplayedCards: [],
    usedCards: [], //discarded or played
    remainingCards: structuredClone(deck), //deck remaining
  }

  return deckStatusTemplate;
}


/** Deals numCards from remainingCards, and adds to dealtCards.
 *  Afterwards, unselects all cards and clears played/unplayed.
 *
 *  Note: if there are too few cards remaining, will deal only the remaining,
 *  resulting in a smaller hand.
 */
export function dealCards(deckStatus:DeckStatus, numCards: number): DeckStatus {
  let newStatus = structuredClone(deckStatus);

  //JS handles case of too little remaining automatically:
  //slice will return a smaller/empty array if insufficient cards to deal.
  const newlyDealt = newStatus.remainingCards.slice(0, numCards);
  const newRemaining = newStatus.remainingCards.slice(numCards);

  newStatus['dealtCards'] = [...newStatus['dealtCards'], ...newlyDealt];
  newStatus['remainingCards'] = newRemaining;
  newStatus = unselectAllCards(newStatus);
  newStatus['unplayedCards'] = [];
  newStatus['playedCards'] = [];
  return newStatus;
}


export function unselectAllCards(deckStatus:DeckStatus): DeckStatus {
  const newStatus = structuredClone(deckStatus);
  newStatus['selectedCards'] = Array(newStatus['dealtCards'].length).fill(false);
  return newStatus;
}


function selectToggle(deckStatus:DeckStatus, selectInd: number): DeckStatus {
  let newStatus = structuredClone(deckStatus);
  if (newStatus.selectedCards.length === 0) {
    newStatus.selectedCards = Array(newStatus.dealtCards.length).fill(false);
  }
  if (selectInd > newStatus.selectedCards.length) return newStatus;

  newStatus.selectedCards[selectInd] = !newStatus.selectedCards[selectInd];
  return newStatus;
}


export function selectCards(deckStatus:DeckStatus, indices: number[]): DeckStatus {
  let newStatus = structuredClone(deckStatus);
  for (let ind of indices){
    newStatus = selectToggle(newStatus, ind);
  }

  return newStatus;
}


/** move selectedCards to usedCards
 * deal selectedCard.length new cards from remaining
 */
export function discardCards(deckStatus: DeckStatus): DeckStatus {
  const newStatus = structuredClone(deckStatus);
  const {dealtCards, selectedCards} = deckStatus;
  const discarded = dealtCards.filter((_, ind) => selectedCards[ind]);
  const leftover = dealtCards.filter((_, ind) => !selectedCards[ind]);
  newStatus['usedCards'] = [...discarded, ...newStatus['usedCards']];
  newStatus['dealtCards'] = leftover;

  let nToDeal = discarded.length;
  let refilled = dealCards(newStatus, nToDeal); //also unselects
  return refilled;
}


/** Moves selectedCards to playedCards, copies unselected to unplayedCards,
 *  and removes playedCards from dealtCards
 */
export function playCards(deckStatus:DeckStatus): DeckStatus {
  const newStatus = structuredClone(deckStatus);
  const {dealtCards, selectedCards} = deckStatus;
  const playedCards = dealtCards.filter((_, ind) => selectedCards[ind]);
  const unplayedCards = dealtCards.filter((_, ind) => !selectedCards[ind]);

  newStatus.playedCards = playedCards;
  newStatus.unplayedCards = unplayedCards;
  newStatus.dealtCards = unplayedCards;

  return newStatus;
}


/** move playedCards to usedCards, and refills hand.
 * Dealing cards will clear selected, played, and unplayed. */
function cleanupPlayed(deckStatus:DeckStatus): DeckStatus {
  const newStatus = structuredClone(deckStatus);

  newStatus['usedCards'] = [...newStatus['playedCards'], ...newStatus['usedCards']];

  let nToDeal = newStatus['playedCards'].length;
  let refilled = dealCards(newStatus, nToDeal);
  return refilled;
}


/** rebuilds deck from old cards, shuffles, and returns
 * a new deck status with buildDeckStatus.
 * A 'reset' deck has a deck and remainingCards, nothing else. */
function resetDeck(deckStatus:DeckStatus): DeckStatus {
  const newStatus = structuredClone(deckStatus);

  const newDeck = [
    ...newStatus['dealtCards'],
    ...newStatus['usedCards'],
    ...newStatus['remainingCards'],
  ];
  const shuffledDeck = shuffle(newDeck);
  let reset = buildDeckStatus(shuffledDeck);
  return reset;
}


export function finishRound(deckStatusStart:DeckStatus,
  runStatusStart:RunStatus,
  roundStatusStart:RoundStatus) {

  let currentDeck:DeckStatus = structuredClone(deckStatusStart);
  let currentRun:RunStatus = structuredClone(runStatusStart);
  let currentRound:RoundStatus = structuredClone(roundStatusStart);

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
    deckStatus: cleanDeck,
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
  newStock['voucher'].push(possVouchers[0]);


  //add packs
  let possPacks = buildPackVariations();
  possPacks = shuffle(possPacks);
  newStock['pack'].push(possPacks[0]);
  newStock['pack'].push(possPacks[1]);

  return newStock;
}
// stock = {
//   'shelf': [{category: 'joker', item: jokerInst}, ...],
//   'voucher': [VoucherTypes],
//   'pack': [{packType: planet|tarot, size:]
// }
type ShelfItem = {category: string, item:Joker|Card|Tarot|Planet};
function buildStock(){
  const shelf:ShelfItem[] = [];
  const voucher:VoucherTypes[] = [];
  const pack:Pack[] = [];
  return {shelf, voucher, pack};
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
  let versions = [1, 2];

  for (let packType of packTypes){
    for (let size of sizes){
      for (let version of versions){
        let newPack = {packType, size, version} as Pack;
        packs.push(newPack);
      }
    }
  }

  return packs;
}
// function buyItem(stock, category:'shelf'|'voucher'|'pack', ind=0){

// }

function openPack(pack:Pack, baseDeck:DeckStatus, baseRun:RunStatus){

  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);

  let {packType} = pack;
  let result;
  if (packType === 'planet'){
    result = openPlanetPack(currentRun);
    currentRun = result['runStatus'];
  } else if (packType === 'tarot'){
    result = openTarotPack(pack, currentDeck, currentRun);
    currentDeck = result['deckStatus'];
    currentRun = result['runStatus'];
  }

  return {
    deckStatus: currentDeck,
    runStatus: currentRun,
  }
}

// function openCardPack(){

// }


function openPlanetPack(baseRun:RunStatus){
  let currentRun = structuredClone(baseRun);

  return {
    runStatus: currentRun,
  }
}


function openTarotPack(pack:Pack, deckStatusStart:DeckStatus,
  runStatusStart:RunStatus){
  let {size:sizeName, packType} = pack;
  if (packType !== 'tarot') throw new Error('incorrect pack passed');

  let packSizes = {'normal': 4, 'jumbo': 5, 'mega': 6};
  let packSize = packSizes[sizeName];

  let currentDeck:DeckStatus = structuredClone(deckStatusStart);
  let currentRun:RunStatus = structuredClone(runStatusStart);

  let dealtTarots = dealTarots(packSize);
  let selectedTarot = Array(packSize).fill(false);

  //select tarot
  let tarotChoices = chooseRandom(1, dealtTarots.length);
  let tarotChoice = dealtTarots[tarotChoices[0]];
  let selectCount = tarotChoice.cardCount;

  //select cards
  currentDeck = dealCards(currentDeck, baseHandSize);
  let cardChoices = chooseRandom(selectCount, currentDeck['dealtCards'].length);
  currentDeck = selectCards(currentDeck, cardChoices);

  //use Tarot
  const tarotFn = allTarotFunctions[tarotChoice['name']];
  let tarotResult = tarotFn(currentDeck, currentRun);

  return {
    deckStatus: tarotResult['deckStatus'],
    runStatus: tarotResult['runStatus'],
  }
}


export function buildStartDeck(): Card[] {
  const ranks = Array(13).fill(0).map((_, ind) => ind+1) as RankNum[];
  const suits: Suit[] = ['hearts', 'diamonds', 'spades', 'clubs'];

  let newDeck = [];
  for (let suit of suits) {
    for (let rank of ranks){
      let newCard = makeCard(rank, suit);
      newDeck.push(newCard);
    }
  }
  return newDeck;
}


export function buildSimpleDeck(): Card[]{
  const ranks = Array(5).fill(0).map((_, ind) => ind+1) as RankNum[];
  const suits: Suit[] = ['hearts', 'diamonds', 'spades', 'clubs'];

  let newDeck = [];
  for (let suit of suits) {
    for (let rank of ranks){
      let newCard = makeCard(rank, suit);
      newDeck.push(newCard);
    }
  }
  return newDeck;
}


export function findCards(deck:Card[], searchType:'suit'|'rank', match:Suit|RankNum){
  let foundCards: Card[] = [];
  if (searchType === 'suit'){
    foundCards = deck.filter(card => {
      if (card.suit === match) return true;
    });
  } else if (searchType === 'rank'){
    foundCards = deck.filter(card => {
      if (card.rank === match) return true;
    });
  }
  return foundCards;
}


/** Finds jokers that match the current phase of play, and returns their functions
 * activePhased could be scorePlayed, scoreJokers, or others...
 */
export function findActiveJokers(jokers:Joker[], activePhase:string){
  const jokerFns = [];
  for (let joker of jokers){
    let jokerName = '';
    if (joker['activePhase'] === activePhase) jokerName = joker['name'];
    if (jokerName) jokerFns.push(allJokerFunctions[jokerName]);
  }

  return jokerFns;
}


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


/** Returns an array with [count] random indices.
 * Indices are between 0 and maxSize, exclusive*/
export function chooseRandom(count:number, maxSize:number=baseHandSize){
  let allIndices = Array(maxSize).fill(-1).map((_, ind) => ind);
  let indices = shuffle(allIndices).slice(0,count);
  return indices;
}