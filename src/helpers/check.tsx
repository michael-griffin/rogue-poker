//https://balatrogame.fandom.com/wiki/Card_Modifiers
//TODO: update check functions to replace scoringHand (Card[]) with
//scoredCards (boolean[])

/** A collection of functions that takes a hand and sees what type
 * of poker hand it is. The controller function is checkAllHands, which
 * returns a HandStatus.
 *
 * Helper functions check individual handTypes, like pair/flush/straight.
 *
 */
import { totalmem } from 'os';
import {
  RankNum,
  Suit,
  Card,
  Joker,
  HandTypes,
  HandStatus,
  CheckResult,
} from '../types/misc'
import {getRankInfo} from './cards/cards';


/* Hand collection data structure

/**
 * Builds the handStatus object above by calling each checkHand function
 *
 */
export function checkAllHands(hand: Card[], jokers: Joker[] = []): HandStatus {
  //checkFlush
  //update handStatus
  //checkStraight + update

  //CheckPairs (and helper calls?)
  const handStatus: HandStatus = {
    hand: [],
    bestHand: 'highCard',
    highScore: 0,
    handTypes: [],
    scoredCards: {},
  };
  //  const {bestHand} = checkAllResult;
  //  const isScored = checkAllResult['scoredCards'][bestHand];

  /*
  let checkFunctions = [checkPair, checkFlush, checkStraight];
  for (let checkFunction of checkFunctions){
    const {match, handType, scoringHand} = checkFunction(currentHand);
    if (match){
      //update handStatus
    }
  }
  */
  return handStatus;
}




type CheckHandfn = (hand: Card[]) => CheckResult
function checkHand(hand: Card[]): CheckResult {
  return {
    match: true,
    handType: 'pair',
    scoredCards: [] //true true false false false for an example pair.
  }
}
checkHand satisfies CheckHandfn


export function checkHighCard(hand: Card[]): CheckResult {
  let match: boolean = true; //highCard is always true.
  const handType: HandTypes = 'highCard';
  let scoredCards: boolean[] = Array(hand.length).fill(false);

  let ranks = hand.map(({rank}:Card) => rank);
  let highRank = Math.max(...ranks);
  scoredCards = ranks.map(rank => rank === highRank);

  return {match, handType, scoredCards};
}


/** Checks whether a pair or higher is present in hand.
 *
 * Note: this is INCLUSIVE, a four of a kind still contains a pair.
 * Done for jokers, which can check whether a pair is present.
 * 2nd Note: scoredCards are a little wonky for lower cases: a fiveOf
 * will register the lower types if count as lower, but scoredCards will be all
 * true. Should be fine, since scoredCards is only looked at for the highest hand.
 */
export function checkPairToFive(hand: Card[], count: 2|3|4|5): CheckResult {
  const possTypes = {
    2: 'pair',
    3: 'threeOf',
    4: 'fourOf',
    5: 'fiveOf'
  };
  let match: boolean = false;
  const handType: HandTypes = possTypes[count] as HandTypes;
  let scoredCards: boolean[] = Array(hand.length).fill(false);;

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
  scoredCards = hand.map(({rank}: Card) => relevantRanks.includes(rank));

  return {match, handType, scoredCards};
}


/** Checks for the presence of two distinct pairs.
 *
 */
export function checkMultPairs(hand: Card[],
  handType:'twoPair'|'fullHouse'|'flushHouse'): CheckResult {

  let match: boolean = false;
  //let handType: HandTypes = 'twoPair';
  let scoredCards: boolean[] = Array(hand.length).fill(false);

  const rankCounts: Record<string, number> = {};
  for (let {rank} of hand){
    rankCounts[rank] = rankCounts[rank] + 1 || 1;
  }

  //filter rankCounts to pair or more.
  //if rankCounts length == 2, continue.
  //add cards that have matching ranks
  //if scoringHand.length === 5 then fullHouse

  let relevantCounts = Object.entries(rankCounts).filter(([_, val]) => val >= 2);
  let relevantRanks = relevantCounts.map(([key, _]) => +key);

  if (relevantRanks.length < 2) return {match, handType, scoredCards};

  let scoredCount = 0;
  for (let i = 0; i < hand.length; i++){
    let { rank } = hand[i];
    if (relevantRanks.includes(rank)) {
      scoredCards[i] = true;
      scoredCount++;
    }
  }

  if (handType === 'twoPair'){
    match = true;
  } else if (scoredCount === 4){ //did not reach fullHouse/flushHouse,
    scoredCards = Array(hand.length).fill(false);
  } else if (handType === 'fullHouse'){
    match = true;
  } else if (handType === 'flushHouse'){
    let flushResult = checkFlush(hand);
    if (flushResult){
      match = true;
    } else {
      scoredCards = Array(hand.length).fill(false);
    }
  }

  return {match, handType, scoredCards};
}
// if (scoredCount === 4){
//   handType = 'twoPair';
// } else if (scoredCount === 5){
//   let flushResult = checkFlush(hand);
//   if (flushResult.match) handType = 'flushHouse';
//   else handType = 'fullHouse';
// }


/** Checks for straights. Straights can be standard or ace high.
 * - with fourFingers joker, straights require only 4 valid cards for the hand to score
 * - with shortcut joker, straights can have gaps of 1 rank
 *
 * @param hand
 * @param jokers
 */
export function checkStraight(hand: Card[], jokers: Joker[] = []): CheckResult  {

  let match: boolean = false;
  let handType: HandTypes = 'straight';
  let scoredCards: boolean[] = Array(hand.length).fill(false);

  let gap = 1;
  let minSize = 5;
  const jokerNames = jokers.map(({ name } : Joker) => name);
  if (jokerNames.includes('fourFingers')) minSize = 4;
  if (jokerNames.includes('shortcut')) gap = 2;
  const sortedHand = structuredClone(hand);
  sortedHand.sort((cardOne, cardTwo) => {
    return cardOne.rank - cardTwo.rank;
  })

  //loop through sorted values.
    //if first value is low rank, check wraparound ace. Otherwise
    //if current card and next card value diff matches gap, increment seqLength
  let sequenceLength = 1;
  let maxSequence = -1;
  for (let i = 0; i < sortedHand.length - 1; i++){
    let currCard = sortedHand[i];
    let nextCard = sortedHand[i+1];
    let rankDiff = Math.abs(nextCard.rank - currCard.rank);
    let validNext = rankDiff <= gap && rankDiff > 0;

    if (validNext){
      sequenceLength++;
      if (nextCard.name === 'king' && sortedHand[0].name === 'ace') sequenceLength++;
      maxSequence = Math.max(sequenceLength, maxSequence);
    } else {
      sequenceLength = 1;
    }
  }

  if (maxSequence >= minSize){
    match = true;
    scoredCards = Array(hand.length).fill(true);
  }

  return { match, handType, scoredCards }
}
type CheckStraightfn = (hand: Card[], jokers: Joker[]) => CheckResult
checkStraight satisfies CheckStraightfn


/** Checks for flushes.
 * - with fourFingers joker, flushes require only 4 valid cards.
 * - with smearedJoker, flushes can be made by color, rather than suit.
 */
export function checkFlush(hand: Card[], jokers: Joker[] = []): CheckResult {
  let match: boolean = false;
  let handType: HandTypes = 'flush';
  let scoredCards: boolean[] = Array(hand.length).fill(false);

  let minSize = 5;
  let checkType:'suits'|'colors' = 'suits';
  const jokerNames = jokers.map(({ name } : Joker) => name);
  if (jokerNames.includes('fourFingers')) minSize = 4;
  if (jokerNames.includes('smearedJoker')) checkType = 'colors';

  type SuitKey = "clubs" | "diamonds" | "hearts" | "spades"
  const suitCounts = {
    spades: 0,
    hearts: 0,
    clubs: 0,
    diamonds: 0,
  }
  let wildCount = 0;

  for (let card of hand){
    if (card.enhanced === "wild"){
      wildCount++;
    } else if (card.enhanced !== "stone"){
      suitCounts[card.suit] += 1;
    }
  }

  if (checkType === 'suits'){
    for (let key in suitCounts){
      if (suitCounts[key as SuitKey] + wildCount >= minSize){
        match = true;
      }
    }
  } else if (checkType === 'colors'){
    let redCount = suitCounts['diamonds'] + suitCounts['hearts'];
    let blackCount = suitCounts['clubs'] + suitCounts['spades'];
    if (redCount + wildCount > minSize || blackCount + wildCount > minSize){
      match = true;
    }
  }

  if (match) scoredCards = Array(hand.length).fill(true);
  return { match, handType, scoredCards };
}
type CheckFlushFn = (hand: Card[], jokers: Joker[]) => CheckResult
checkFlush satisfies CheckFlushFn;


/** Checks for straight flushes, but not royal flushes
 *  fourFingers + shortcut jokers work as they do in checkFlush + checkStraight */
export function checkStraightFlush(hand:Card[], jokers:Joker[]): CheckResult {
  let match = false;
  let handType:HandTypes = 'straightFlush';
  let scoredCards = Array(hand.length).fill(false);

  const flushResult = checkFlush(hand, jokers);
  const straightResult = checkStraight(hand, jokers);
  if (flushResult.match && straightResult.match) match = true;

  if (match) scoredCards = Array(hand.length).fill(true);
  return { match, handType, scoredCards };
}


/** Checks for Royal Flushes using straightFlush */
export function checkRoyalFlush(hand:Card[], jokers:Joker[]): CheckResult {
  let {match, handType, scoredCards} = checkStraightFlush(hand, jokers);
  handType = 'royalFlush';

  const sortedHand = hand.sort((cardA, cardB) => cardA.rank - cardB.rank);
  let sortedNames = sortedHand.map(card => card.name).join('-');
  const royalFlushCheck = 'ace-10-jack-queen-king';
  if (sortedNames === royalFlushCheck) match = true;

  return { match, handType, scoredCards };
}

/******************/
/** OLD VERSIONS **/
/******************/


// //This version excludes 'irrelevant' cards from scoring when fourFingers
// //is present. Simplified to keep consistent with straight.
// export function checkFlush(hand: Card[], jokers: Joker[] = []): CheckResult {
//   let match: boolean = false;
//   let handType: HandTypes = 'flush';
//   let scoredCards: boolean[] = Array(hand.length).fill(false);

//   let minSize = 5;
//   let checkType:'suits'|'colors' = 'suits';
//   const jokerNames = jokers.map(({ name } : Joker) => name);
//   if (jokerNames.includes('fourFingers')) minSize = 4;
//   if (jokerNames.includes('smearedJoker')) checkType = 'colors';

//   type SuitKey = "clubs" | "diamonds" | "hearts" | "spades"
//   const suitCounts = {
//     spades: 0,
//     hearts: 0,
//     clubs: 0,
//     diamonds: 0,
//   }
//   let wildCount = 0;

//   for (let card of hand){
//     if (card.enhanced === "wild"){
//       wildCount++;
//     } else if (card.enhanced !== "stone"){
//       suitCounts[card.suit] += 1;
//     }
//   }


//   if (checkType === 'suits'){
//     for (let key in suitCounts){
//       if (suitCounts[key as SuitKey] + wildCount >= minSize){
//         match = true;
//       }
//     }

//     if (match){
//       let highSuit:SuitKey;
//       let highCount = Math.max(...Object.values(suitCounts));
//       let suits:SuitKey[] = Object.keys(suitCounts) as SuitKey[];
//       for (let suit of suits){
//         if (suitCounts[suit] === highCount) {
//           highSuit = suit;
//           break;
//         }
//       }

//       scoredCards = hand.map(({suit, enhanced}:Card) => {
//         const scored = (suit === highSuit || enhanced === 'wild' || enhanced === 'stone');
//         return scored;
//       })
//     }
//   } else if (checkType === 'colors'){
//     let redCount = suitCounts['diamonds'] + suitCounts['hearts'];
//     let blackCount = suitCounts['clubs'] + suitCounts['spades'];
//     if (redCount + wildCount > minSize || blackCount + wildCount > minSize){
//       match = true;
//     }

//     if (match){
//       let highSuit:SuitKey[];
//       if (redCount > blackCount) {
//         highSuit = ['hearts', 'diamonds'];
//       } else {
//         highSuit = ['clubs', 'spades'];
//       }

//       scoredCards = hand.map(({suit, enhanced}:Card) => {
//         const scored = (highSuit.includes(suit)||enhanced==='wild'||enhanced==='stone');
//         return scored;
//       })
//     }
//   }

//   return { match, handType, scoredCards };
// }
