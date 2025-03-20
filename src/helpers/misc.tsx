import {RankNum, Suits, Card, Joker} from '../types/misc'

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
  type: 'ace' | 'face' | 'number',
}
export function getRankInfo(rank: RankNum): RankInfo {

  let cardType: 'ace' | 'face' | 'number';
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
    type: cardType,
  }
  return rankInfo;
}


export function buildStartDeck(): Card[] {
  const ranks = Array(13).fill(0).map((val, ind) => ind+1);
  const suits: Suits[] = ['hearts', 'diamonds', 'spades', 'clubs'];

  let newDeck = [];
  for (let suit of suits) {
    for (let rank of ranks){
      let {rank:cardRank, type:cardType} = getRankInfo(rank as RankNum);

      let newCard: Card = {
        rank: cardRank,
        type: cardType,
        suit: suit,
        enhanced: null,
        special: null,
        seal: null,
      }
      newDeck.push(newCard);
    }
  }
  return newDeck;
}


export function buildSimpleDeck(): Card[]{
  const ranks = Array(5).fill(0).map((val, ind) => ind+1);
  const suits: Suits[] = ['hearts', 'diamonds', 'spades', 'clubs'];

  let newDeck = [];
  for (let suit of suits) {
    for (let rank of ranks){
      const {rank:cardRank, type:cardType} = getRankInfo(rank as RankNum);
      let newCard: Card = {
        rank: cardRank,
        type: cardType,
        suit: suit,
        enhanced: null,
        special: null,
        seal: null,
      }
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