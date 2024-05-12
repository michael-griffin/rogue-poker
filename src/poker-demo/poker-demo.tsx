type Card = {
  rank: number,
  suit: string,
  type: 'ace' | 'face' | 'number' | 'stone'
  enhanced: string | null,
  special: string | null,
  seal: string | null
}

type Hand = Card[];


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




type CheckHandfn = (hand: Hand) => {scoredCards: Hand, handType: string}
function checkHand(hand: Hand): {scoredCards: Hand, handType: string} {
  return {
    scoredCards: hand,
    handType: 'pair'
  }
}
checkHand satisfies CheckHandfn


type Joker = {
  name: string,
  special: string,
  price: number,
  sellValue: number
}
type CheckStraightFn = (hand: Hand, jokers: Joker[]) =>
  {scoredCards: Hand, isStraight: boolean } | null;


/**
 * Check jokers for possible modifiers.
 *  - 4 card straight allowed
 *  - gaps allowed
 *
 * @param hand
 * @param jokers
 */
function checkStraight(hand: Hand, jokers: Joker[] = []) {
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
