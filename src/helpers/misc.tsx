import {
  RankNum,
  CardType,
  Suit,
  Card,
  Joker,
  RankName,
  Enhancement,
  SpecialCardMod,
  Seal,
  DeckStatus,
  RunStatus,
  RoundStatus,
} from '../types/misc'

import {scoreGoals} from './score';

export const baseHandSize = 8;

export const rankNames = {
  1: 'ace',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: 'jack',
  12: 'queen',
  13: 'king'
};

export const chipValues = {
  1: 11,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 10,
  12: 10,
  13: 10
}

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


/** Deals numCards from remainingCards, and adds to dealtCards
 *  unselects all cards after new hand is dealt
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


/** move playedCards to usedCards,
 *  refills hand
 */
function postPlayCleanup(deckStatus:DeckStatus): DeckStatus {
  const newStatus = structuredClone(deckStatus);

  return newStatus;
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


export function findCards(searchType:'suit'|'rank', match:Suit|RankNum, deck:Card[]){
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


//TODO: templates for the various status types.
export function buildRunStatus(
  difficulty: 'normal'|'hard'|'hell'='normal',
  hands=4, discards=3, startMoney=4,
  handSize=baseHandSize
): RunStatus {

  const newStatus = {
    hands,
    discards,
    handSize,

    currentRound: 1,
    currentAnte: 1,
    currentMoney: startMoney,
    scoreGoals: scoreGoals[difficulty],
    skipTag: null,

    vouchers: [],
    handTypesInfo: {},
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