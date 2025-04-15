//https://balatrogame.fandom.com/wiki/Card_Modifiers

import {RankNum, Suits, Card, Joker} from '../types/misc'
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

{
  bestHand: 'flush',
  highScore: 600,
  handTypes: [flush, threeOf, pair],
  hands {
    royalFlush: undefined,
    straightFlush: undefined,
    straight: undefined,
    flush: [Card1, Card2, ...],
    fiveOf: undefined,
    fourOf: undefined,
    threeOf: [Card1, Card2, ...],
    pair: [Card1, Card2],
    twoPair: undefined,
    fullHouse: undefined,
  }
}
  Other ideas: scored cards could be array of booleans
  [true, false, true, false, false] could be a pair for example.
*/

/**
 * Builds the handInfo object above by calling each checkHand function
 */
function checkAllHands(){
  //checkFlush
  //update handInfo

  //checkStraight + update

  //CheckPairs (and helper calls?)

}


type CheckHandfn = (hand: Card[]) => {scoredCards: Card[], handType: string}
function checkHand(hand: Card[]): {scoredCards: Card[], handType: string} {
  return {
    scoredCards: hand,
    handType: 'pair'
  }
}
checkHand satisfies CheckHandfn


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


    let rankDiff = Math.abs(nextCard.rank - currCard.rank); //should always be positive, but to be safe.
    //If the first card is a low rank, check wrap-around Ace as well.
    if (i === 0 && (currCard.rank - gap) <= 1){
      if (sortedHand[sortedHand.length - 1].type === 'ace'){
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
  }


  //if this is reached, scoredCards is empty, isFlush=false
  return {
    scoredCards,
    isFlush
  }
}
//FIXME: check if checkFlush satisfies CheckFlushFn


