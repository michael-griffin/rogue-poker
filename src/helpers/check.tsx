//https://balatrogame.fandom.com/wiki/Card_Modifiers

import {
  RankNum,
  Suit,
  Card,
  Joker,
  HandTypes,
  HandInfo,
} from '../types/misc'
import {getRankInfo} from './misc';

/**
 * Basic structure:
 *
 * Game: X hands, with an ending condition (lose money? bow out?)
 * Round: Draw Hand
 *  Discard
 *  Play
 *
 * Once played, check scoring
 *  Find hand type for base chips + mult
 *  Add scored cards + extras from enhance/special/seal
 *
*/

/* Hand collection data structure

/**
 * Builds the handInfo object above by calling each checkHand function
 *
 */
function checkAllHands(currentHand: Card[]){
  //checkFlush
  //update handInfo
  //checkStraight + update

  //CheckPairs (and helper calls?)
  const handInfo: HandInfo = {
    bestHand: 'highCard',
    highScore: 0,
    handTypes: [],
    scoringHands: {},
  };
  /*
  let checkFunctions = [checkPair, checkFlush, checkStraight];
  for (let checkFunction of checkFunctions){
    const {match, handType, scoringHand} = checkFunction(currentHand);
    if (match){
      //update handInfo
    }
  }
  */
  return handInfo;
}


type CheckResult = {
  match: boolean,
  handType: HandTypes,
  scoringHand: Card[]
}

type CheckHandfn = (hand: Card[]) => CheckResult
function checkHand(hand: Card[]): CheckResult {
  return {
    match: true,
    handType: 'pair',
    scoringHand: hand
  }
}
checkHand satisfies CheckHandfn


export function checkHighCard(hand: Card[]){
  let result: CheckResult;
  let match: boolean = true; //highCard is always true.
  const handType: HandTypes = 'highCard';
  const scoringHand: Card[] = [];

  let ranks = hand.map(card => {
    let {rank} = card;
    return rank;
  });
  let highRank = Math.max(...ranks);

  let highCard:Card = hand[0];
  for (let card of hand){
    if (card.rank === highRank) highCard = card;
    if (card.name === 'ace') {
      highCard = card;
      break;
    }
  }
  scoringHand.push(highCard);

  result = {match, handType, scoringHand};
  return result;
}

/** Checks whether a pair or higher is present in hand.
 *
 * Note: this is INCLUSIVE, a four of a kind still contains a pair.
 * Done for jokers, which can check whether a pair is present.
 */
export function checkPairToFive(hand: Card[], count: 2|3|4|5): CheckResult {
  const possTypes = {
    2: 'pair',
    3: 'threeOf',
    4: 'fourOf',
    5: 'fiveOf'
  };

  let result: CheckResult;
  let match: boolean = false;
  const handType: HandTypes = possTypes[count] as HandTypes;
  const scoringHand: Card[] = [];

  const rankCounts: Record<string, number> = {};
  for (let {rank} of hand){
    rankCounts[rank] = rankCounts[rank] + 1 || 1;
  }


  let relevantRanks = [];
  for (let rank in rankCounts){
    if (rankCounts[rank] >= count){
      match = true;
      relevantRanks.push(+rank);
      break;
    }
  }

  if (!match) return { match, handType, scoringHand}

  for (let card of hand){
    if (relevantRanks.includes(card['rank'])){
      scoringHand.push(card);
    }
    if (scoringHand.length === count) break;
  }

  result = {match, handType, scoringHand};
  return result;
}

/** Checks for the presence of two distinct pairs.
 *
 */
export function checkTwoPair(hand: Card[]){
  let result: CheckResult;
  let match: boolean = false;
  let handType: HandTypes = 'twoPair'; //can update to fullHouse/flushHouse
  const scoringHand: Card[] = [];

  const rankCounts: Record<string, number> = {};
  for (let {rank} of hand){
    rankCounts[rank] = rankCounts[rank] + 1 || 1;
  }

  //filter rankCounts to pair or more.
  //if rankCounts length == 2, continue.
  //add cards that have matching ranks
  //if scoringHand.length === 5 then fullHouse

  let relCounts = Object.entries(rankCounts).filter(([_, val]) => val >= 2);
  let relRanks = relCounts.map(([key, _]) => +key);

  if (relRanks.length < 2) return {match, handType: 'twoPair', scoringHand};

  match = true;
  for (let card of hand){
    if (relRanks.includes(card.rank)) scoringHand.push(card);
  }

  if (scoringHand.length === 4){
    handType = 'twoPair';
  } else if (scoringHand.length === 5){
    let flushResult = checkFlush(scoringHand);
    if (flushResult.match) handType = 'flushHouse';
    else handType = 'fullHouse';
  }

  return {match, handType, scoringHand};
}



/*Check pairs may need to return a 'hands' bigger object,
then can combine after using myObj[hands] = {...myObj[hands], ...returnedHands}
*/
function checkPairs(hand: Card[]): {scoredCards: Card[], handType: string} {
  /*grab all ranks seen,
  for each rank, go through scoredCards and get count of ranks
  then find highest count.

  */
  let handTypes = ['fiveOf', 'fourOf', 'threeOf', 'pair'] //twoPair, fullHouse added.
  const rankCounts: Record<string, number> = {};
  for (let {rank} of hand){
    rankCounts[rank] = rankCounts[rank] + 1 || 1;
  }

  const highCount = Math.max(...Object.values(rankCounts));
  let handName = '';
  if (highCount === 5){

  } else if (highCount === 4){

  }
  let ind = handTypes.indexOf(handName);
  handTypes = handTypes.slice(ind);
  //handle fullHouse + twoPair


  return {
    scoredCards: hand,
    handType: 'pair'
  }
}


function checkPair(hand: Card[]){
  let result: CheckResult;
  let match: boolean = false;
  const handType: HandTypes = 'pair';
  const scoringHand: Card[] = [];

  const rankCounts: Record<string, number> = {};
  for (let {rank} of hand){
    rankCounts[rank] = rankCounts[rank] + 1 || 1;
  }


  let relevantRanks = [];
  for (let rank in rankCounts){
    if (rankCounts[rank] >= 2){
      match = true;
      relevantRanks.push(+rank);
      break;
    }
  }

  if (!match) return { match, handType, scoringHand}

  for (let card of hand){
    if (relevantRanks.includes(card['rank'])){
      scoringHand.push(card);
    }
    if (scoringHand.length === 2) break;
  }

  result = {match, handType, scoringHand};
  return result;
}


type CheckStraightFn = (hand: Card[], jokers: Joker[]) =>
  {scoredCards: Card[], isStraight: boolean } | null;


/**
 * Check jokers for possible modifiers.
 *  - 4 card straight allowed
 *  - gaps allowed
 *
 * @param hand
 * @param jokers
 */
export function checkStraight(hand: Card[], jokers: Joker[] = []) {
  let gap = 1;
  let minSize = 5;
  //If joker, gap = 2, and/or minSize = 4.
  if (hand.length < minSize) {
    return null;
  }

  //To check,create hand copy, sort copy by values.
  const sortedHand = structuredClone(hand);
  sortedHand.sort((cardOne, cardTwo) => {
    return cardOne.rank - cardTwo.rank;
  })


  //loop through sorted values.
    //if first value is low rank, check wraparound ace. Otherwise
    //if current card and next card value diff matches gap, increment seqLength
  let sequenceLength = 1;
  let maxSequence = -1;

  //May need to modify loop to add scoredCards in.
  for (let i = 0; i < sortedHand.length - 1; i++){
    let currCard = sortedHand[i];
    let nextCard = sortedHand[i+1];

  //should always be positive, but to be safe.
    let rankDiff = Math.abs(nextCard.rank - currCard.rank);
    //If the first card is a low rank, check wrap-around Ace as well.
    if (i === 0 && (currCard.rank - gap) <= 1){
      if (sortedHand[sortedHand.length - 1].name === 'ace'){
        sequenceLength++;
        maxSequence = Math.max(sequenceLength, maxSequence);
      }
    }

    if (rankDiff <= gap && rankDiff > 0){
      sequenceLength++;
      maxSequence = Math.max(sequenceLength, maxSequence);
    } else {
      sequenceLength = 1;
    }
  }

  //if passed maxSequence, return {isStraight + scoredCards}
  //FIXME: update return
  return {
    match: true,
    handType: 'pair',
    scoringHand: hand
  }
}
//FIXME: check if checkStraight satisfies CheckStraightFn


type CheckFlushFn = (hand: Card[], jokers: Joker[]) =>
{scoredCards: Card[], isFlush: boolean } | null;



export function checkFlush(hand: Card[], jokers: Joker[] = []){
  let minSize = 5;
  let isFlush = false;
  let scoredCards: Card[] = [];
  //if Joker, minSize = 4.

  //loop through hand. keep running count of each suit
  //Wildcard adds to all, stone to none.
  //loop through suit counts, if any > minSize, we have a flush.
  //(??) if flush, loop through hand, add suit matches to scored cards (and stones)

  let suitCounts = {
    spades: 0,
    hearts: 0,
    clubs: 0,
    diamonds: 0,
  }
  type SuitKey = "clubs" | "diamonds" | "hearts" | "spades"

  for (let card of hand){
    if (card.enhanced === "wild"){
      for (let key in suitCounts) {
        suitCounts[key as SuitKey] += 1;
      }
    } else if (card.enhanced !== "stone"){
      suitCounts[card.suit] += 1;
    }
  }

  for (let key in suitCounts){
    if (suitCounts[key as SuitKey] >= minSize){
      isFlush = true;
    }
  }

  //populate scoredCards.
  //find largest match, working way down to min size.
  //loop through suitCounts, if count matches handSize

  //score the largest hand with a flush
  for (let scoredSize = hand.length; scoredSize >= minSize; scoredSize--){
    for (let key in suitCounts){
      if (suitCounts[key as SuitKey] === scoredSize){
        for (let currentCard of hand){
          if (currentCard.suit === key) scoredCards.push(currentCard);
        }
        isFlush = true;
        //return first matching flush
        return {
          scoredCards,
          isFlush
        }
      }
    }

    //FIXME: update return
    return {
      match: true,
      handType: 'pair',
      scoringHand: hand
    }
  }


  //if this is reached, scoredCards is empty, isFlush=false
  return {
    scoredCards,
    isFlush
  }
}
//FIXME: check if checkFlush satisfies CheckFlushFn


