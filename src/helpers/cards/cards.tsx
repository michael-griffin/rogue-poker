import {
  Suit,
  Card,
  RankNum,
  RankName,
  CardType,
  Enhancement,
  SpecialCardMod,
  Seal,
  CardDeck,
  BroadDeck,
} from '../../types/misc';

import {rankNames, chipValues, shopInfo,
  allEnhancements, allSpecials, allSeals } from '../constants';

import { shuffle, pickRandom } from '../actions/misc';


/***************** */
/** SELECT METHODS */
/***************** */
/** For a given index, set selectedCards[ind] = !selected */
//function toggleSelect(baseDeck:BroadDeck, selectInd: number): BroadDeck {
function toggleSelect<Deck extends BroadDeck>(baseDeck:Deck, selectInd:number): Deck {
  let newDeck = structuredClone(baseDeck);
  if (newDeck.selectedCards.length === 0) {
    newDeck.selectedCards = Array(newDeck.dealtCards.length).fill(false);
  }
  if (selectInd > newDeck.selectedCards.length) return newDeck;

  newDeck.selectedCards[selectInd] = !newDeck.selectedCards[selectInd];
  return newDeck;
}

/** Given an array of indices, toggle selection state for each. */
export function selectCards<Deck extends BroadDeck>(baseDeck:Deck, indices:number[])
: Deck {
  let newDeck = structuredClone(baseDeck);
  for (let ind of indices){
    newDeck = toggleSelect(newDeck, ind);
  }
  return newDeck;
}

/** rebuilds selectedCards array:
 * - length set to match dealtCards
 * - all values set to false */
export function unselectAllCards(baseDeck:BroadDeck): BroadDeck {
  const newDeck = structuredClone(baseDeck);
  newDeck['selectedCards'] = Array(newDeck['dealtCards'].length).fill(false);
  return newDeck;
}

/** Returns an array of only cards that are selected */
export function getSelectedCards(baseDeck:BroadDeck){
  let currentDeck = structuredClone(baseDeck);

  const cardsSelected = currentDeck['dealtCards'].filter((_, ind) => {
    return currentDeck.selectedCards[ind];
  });
  return cardsSelected;
}





/***************** */
/** CARD Functions */
/***************** */

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

export function findCards(cards:Card[], searchType:'suit'|'rank', match:Suit|RankNum){
  let foundCards: Card[] = [];
  if (searchType === 'suit'){
    foundCards = cards.filter(card => {
      if (card.suit === match) return true;
    });
  } else if (searchType === 'rank'){
    foundCards = cards.filter(card => {
      if (card.rank === match) return true;
    });
  }
  return foundCards;
}


/***************** */
/** DECK Functions */
/***************** */
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

export function buildCardDeck(deck: Card[]=[]): CardDeck {
  if (deck.length === 0){
    deck = makeStartingCards();
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


export function makeStartingCards(): Card[] {
  const ranks = Array(13).fill(0).map((_, ind) => ind+1) as RankNum[];
  const suits: Suit[] = ['hearts', 'diamonds', 'spades', 'clubs'];

  let startingCards = [];
  for (let suit of suits) {
    for (let rank of ranks){
      let newCard = makeCard(rank, suit);
      startingCards.push(newCard);
    }
  }
  return startingCards;
}

/** Make 52 random cards.
 * - Upgrades are included at .2 chance overall
 * - weighted 10/5/2 for enhance/special/seal
*/
export function makeRandomCards(upgrade=true): Card[] {
  let randomCards = makeStartingCards();

  if (upgrade){
    const { upgradeChance, cardUpgradeRates } = shopInfo;
    let possUpgradeTypes = [];
    for (let [category, quantity] of Object.entries(cardUpgradeRates)){
      for (let i = 0; i < quantity; i++){
        possUpgradeTypes.push(category);
      }
    }
    possUpgradeTypes = shuffle(possUpgradeTypes);


    for (let i = 0; i < randomCards.length; i++){
      let upgradeRoll = Math.random();

      if (upgradeRoll < upgradeChance){
        let upgradeType = pickRandom(possUpgradeTypes);
        let upgradedCard: Card = randomCards[i];
        if (upgradeType === 'enhanced') upgradedCard['enhanced'] = pickRandom(allEnhancements);
        if (upgradeType === 'special') upgradedCard['special'] = pickRandom(allSpecials);
        if (upgradeType === 'seal') upgradedCard['seal'] = pickRandom(allSeals);
        randomCards[i] = upgradedCard;
      }
    }
  }


  randomCards = shuffle(randomCards);
  return randomCards;
}


/** Add cards */

/** Add card to (end of) hand. updates selected/unselected cards, but does
 * not immediately change deck */

export function addToHand(baseDeck:CardDeck, newCard:Card): CardDeck {
  let newDeck = structuredClone(baseDeck);
  newDeck['dealtCards'].push(newCard);
  newDeck['selectedCards'].push(false);
  return newDeck;
}


export function addToDeck(baseDeck:CardDeck, newCard:Card): CardDeck {
  let newDeck = structuredClone(baseDeck);
  newDeck['deck'].push(newCard);
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
  newDeck = unselectAllCards(newDeck) as CardDeck;
  newDeck['unplayedCards'] = [];
  newDeck['playedCards'] = [];
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
 * This clears dealt, selected, played, unplayed, and used.
 * A 'reset' deck has a deck and remainingCards, nothing else. */
export function resetDeck(baseDeck:CardDeck): CardDeck {
  const newDeck = structuredClone(baseDeck);

  const cardsForReset = [
    ...newDeck['dealtCards'],
    ...newDeck['usedCards'],
    ...newDeck['remainingCards'],
  ];
  const shuffledCards:Card[] = shuffle(cardsForReset);
  const reset = buildCardDeck(shuffledCards);
  return reset;
}



const cardDeckFns = {
  toggleSelect,
  selectCards,
  unselectAllCards,
  getSelectedCards,
  dealCards,
  addToHand,
  addToDeck,
  buildCardDeck,
  buildSimpleDeck,
  resetDeck,
}

const cardFns = {
  getRankInfo,
  makeCard,
  //enhanceCard, //cutting: just use card[upgradeType] = val;
  makeStartingCards,
  makeRandomCards,
  findCards,
}




/************** */
/*NO LONGER USED*/
/************** */
