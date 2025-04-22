import {RankNum, CardType, Suit, Card, Joker, RankName, Enhancement, SpecialCardMod, Seal} from '../types/misc'

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

//type RankNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
type RankInfo = {
  rank: RankNum,
  name: string,
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
    cardType: cardType,
  }
  return rankInfo;
}


export function makeCard(rank: RankNum, suit:Suit): Card {
  const rankInfo = getRankInfo(rank);
  const name = rankInfo['name'] as RankName;
  const cardType = rankInfo['cardType'] as CardType;

  const card = {
    suit,
    rank,
    name,
    cardType,
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
export function enhanceCard(card: Card, enhanced=null as Enhancement | null,
  special=null as SpecialCardMod | null, seal=null as Seal | null): Card {

  if (enhanced !== null) card['enhanced'] = enhanced;
  if (special !== null) card['special'] = special;
  if (seal !== null) card['seal'] = seal;

  return card;
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
  const ranks = Array(5).fill(0).map((val, ind) => ind+1) as RankNum[];
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


export function findCards(searchType:'suit'|'rank', match:string, deck:Card[]){
  let foundCards: Card[] = [];
  if (searchType === 'suit'){
    foundCards = deck.filter(card => {
      if (card.suit === match) return true;
    });
  } else if (searchType === 'rank'){
    foundCards = deck.filter(card => {
      if (card.rank === +match) return true;
    });
  }
  return foundCards;
}