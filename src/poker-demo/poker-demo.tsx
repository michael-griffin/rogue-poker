//https://balatrogame.fandom.com/wiki/Card_Modifiers

import {Card, Joker} from '../types/misc-types'

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

type CheckHandfn = (hand: Card[]) => {scoredCards: Card[], handType: string}
function checkHand(hand: Card[]): {scoredCards: Card[], handType: string} {
  return {
    scoredCards: hand,
    handType: 'pair'
  }
}
checkHand satisfies CheckHandfn



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
function checkStraight(hand: Card[], jokers: Joker[] = []) {
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



function checkFlush(hand: Card[], jokers: Joker[] = []){
  let minSize = 5;
  let isFlush = false;
  //if Joker, minSize = 4.

  //loop through hand. keep running count of each suit
  //Wildcard adds to all, stone to none.
  //loop through suit counts, if any > minSize, we have a flush.
  //(??) if flush, loop through hand, add suit matches to scored cards (and stones)

  let suitCounts = {
    clubs: 0,
    diamonds: 0,
    hearts: 0,
    spades: 0
  }

  for (let card of hand){
    if (card.type !== "stone"){
      suitCounts[card.suit] += 1;
    }
  }

  type SuitKey = "clubs" | "diamonds" | "hearts" | "spades"
  for (let key in suitCounts){
    if (suitCounts[key as SuitKey] > minSize){
      isFlush = true;
    }
  }


}
//FIXME: check if checkFlush satisfies CheckFlushFn


