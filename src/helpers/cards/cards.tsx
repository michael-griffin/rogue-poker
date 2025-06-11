import {
  Suit,
  Card,
  RankNum,
  RankName,
  CardType,
  Enhancement,
  SpecialCardMod,
  Seal,
  CardDeck
} from '../../types/misc';

import {rankNames, chipValues} from '../constants';

import { shuffle } from '../misc';


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

export function buildCardDeck(deck: Card[]=[]): CardDeck {
  if (deck.length === 0){
    deck = buildStartDeck();
  }

  const cardDeckTemplate = {
    deck: structuredClone(deck), //when moving to react, need to avoid mutating.
    dealtCards: [], //handSize active cards, can be played or discarded.
    selectedCards: [],
    playedCards: [],
    unplayedCards: [],
    usedCards: [], //discarded or played
    remainingCards: structuredClone(deck), //deck remaining
  }

  return cardDeckTemplate;
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
  const suits: Suit[] = ['hearts', 'spades']; //'diamonds', 'clubs',

  let newDeck = [];
  for (let suit of suits) {
    for (let rank of ranks){
      let newCard = makeCard(rank, suit);
      newDeck.push(newCard);
    }
  }
  return newDeck;
}


/** Deals numCards from remainingCards, and adds to dealtCards.
 *  Afterwards, unselects all cards and clears played/unplayed.
 *
 *  Note: if there are too few cards remaining, will deal only the remaining,
 *  resulting in a smaller hand.
 */
export function dealCards(baseDeck:CardDeck, numCards: number): CardDeck {
  let newDeck = structuredClone(baseDeck);

  //JS handles case of too little remaining automatically:
  //slice will return a smaller/empty array if insufficient cards to deal.
  const newlyDealt = newDeck.remainingCards.slice(0, numCards);
  const newRemaining = newDeck.remainingCards.slice(numCards);

  newDeck['dealtCards'] = [...newDeck['dealtCards'], ...newlyDealt];
  newDeck['remainingCards'] = newRemaining;
  newDeck = unselectAllCards(newDeck);
  newDeck['unplayedCards'] = [];
  newDeck['playedCards'] = [];
  return newDeck;
}





function selectToggle(baseDeck:CardDeck, selectInd: number): CardDeck {
  let newDeck = structuredClone(baseDeck);
  if (newDeck.selectedCards.length === 0) {
    newDeck.selectedCards = Array(newDeck.dealtCards.length).fill(false);
  }
  if (selectInd > newDeck.selectedCards.length) return newDeck;

  newDeck.selectedCards[selectInd] = !newDeck.selectedCards[selectInd];
  return newDeck;
}


export function selectCards(baseDeck:CardDeck, indices: number[]): CardDeck {
  let newDeck = structuredClone(baseDeck);
  for (let ind of indices){
    newDeck = selectToggle(newDeck, ind);
  }

  return newDeck;
}


export function unselectAllCards(baseDeck:CardDeck): CardDeck {
  const newDeck = structuredClone(baseDeck);
  newDeck['selectedCards'] = Array(newDeck['dealtCards'].length).fill(false);
  return newDeck;
}

/** move selectedCards to usedCards
 * deal selectedCard.length new cards from remaining
 */
export function discardCards(baseDeck: CardDeck): CardDeck {
  const newDeck = structuredClone(baseDeck);
  const {dealtCards, selectedCards} = baseDeck;
  const discarded = dealtCards.filter((_, ind) => selectedCards[ind]);
  const leftover = dealtCards.filter((_, ind) => !selectedCards[ind]);
  newDeck['usedCards'] = [...discarded, ...newDeck['usedCards']];
  newDeck['dealtCards'] = leftover;

  let nToDeal = discarded.length;
  let refilled = dealCards(newDeck, nToDeal); //also unselects
  return refilled;
}


/** Moves selectedCards to playedCards, copies unselected to unplayedCards,
 *  and removes playedCards from dealtCards
 */
export function playCards(baseDeck:CardDeck): CardDeck {
  const newDeck = structuredClone(baseDeck);
  const {dealtCards, selectedCards} = baseDeck;
  const playedCards = dealtCards.filter((_, ind) => selectedCards[ind]);
  const unplayedCards = dealtCards.filter((_, ind) => !selectedCards[ind]);

  newDeck.playedCards = playedCards;
  newDeck.unplayedCards = unplayedCards;
  newDeck.dealtCards = unplayedCards;

  return newDeck;
}


/** move playedCards to usedCards, and refills hand.
 * Dealing cards will clear selected, played, and unplayed. */
function cleanupPlayed(baseDeck:CardDeck): CardDeck {
  const newDeck = structuredClone(baseDeck);

  newDeck['usedCards'] = [...newDeck['playedCards'], ...newDeck['usedCards']];

  let nToDeal = newDeck['playedCards'].length;
  let refilled = dealCards(newDeck, nToDeal);
  return refilled;
}


/** rebuilds deck from old cards, shuffles, and returns
 * a new deck status with buildCardDeck.
 * A 'reset' deck has a deck and remainingCards, nothing else. */
export function resetDeck(baseDeck:CardDeck): CardDeck {
  const newDeck = structuredClone(baseDeck);

  const cardsForReset = [
    ...newDeck['dealtCards'],
    ...newDeck['usedCards'],
    ...newDeck['remainingCards'],
  ];
  const shuffledCards = shuffle(cardsForReset);
  let reset = buildCardDeck(shuffledCards);
  return reset;
}


const cardDeckFns = {
  dealCards,
  selectToggle,
  selectCards,
  unselectAllCards,
  buildCardDeck,
  buildSimpleDeck,
  buildStartDeck,
  resetDeck,
}

const cardFns = {
  getRankInfo,
  makeCard,
  enhanceCard,
  findCards,
}