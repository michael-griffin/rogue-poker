/*
https://www.reddit.com/r/balatro/comments/1blbexa/detailed_break_down_of_balatro_scoring_system_and/

https://balatrogame.fandom.com/wiki/Poker_Hands
https://balatrogame.fandom.com/wiki/Planet_Cards
*/

//TODO: update deckStatus -> cardDeck

//import { allJokerFunctions } from "./jokers";
import { ScoreChange, Joker, Card,
  RunStatus, CardDeck, RoundStatus, HandStatus} from "../types/misc";
import { findActiveJokers } from "./cards/jokers";
import { checkAllHands } from "./check";

/*base scoring goals for each ante, starting at Ante 0
* small blinds are x1, big x1.5, boss x2
* green stake or higher leads to hard scaling, purpl to hell
*/

/*
export const scoreGoals = {
  normal: [100, 300, 800, 2000, 5000, 11000, 20000, 35000, 50000],
  hard: [100, 300, 900, 2600, 8000, 20000, 36000, 60000, 100000],
  hell: [100, 300, 1000, 3200, 9000, 25000, 60000, 110000, 200000],
}

const baseScores = {
  'highCard':       {'chip': 5,   'mult': 1},
  'pair':           {'chip': 10,  'mult': 2},
  'threeOf':        {'chip': 30,  'mult': 3},
  'fourOf':         {'chip': 60,  'mult': 7},
  'fiveOf':         {'chip': 120, 'mult': 12},
  'flushFive':      {'chip': 160, 'mult': 16},
  'twoPair':        {'chip': 20,  'mult': 2},
  'fullHouse':      {'chip': 40,  'mult': 4},
  'flushHouse':     {'chip': 140, 'mult': 14},
  'flush':          {'chip': 35,  'mult': 4},
  'straight':       {'chip': 30,  'mult': 4},
  'straightFlush':  {'chip': 100, 'mult': 8},
  'royalFlush':     {'chip': 100, 'mult': 8},
}

const levelUps = {
  'highCard':       {'chip': 10, 'mult': 1},
  'pair':           {'chip': 15, 'mult': 1},
  'threeOf':        {'chip': 20, 'mult': 2},
  'fourOf':         {'chip': 30, 'mult': 3},
  'fiveOf':         {'chip': 35, 'mult': 3},
  'flushFive':      {'chip': 50, 'mult': 3},
  'twoPair':        {'chip': 20, 'mult': 1},
  'fullHouse':      {'chip': 25, 'mult': 2},
  'flushHouse':     {'chip': 40, 'mult': 4},
  'flush':          {'chip': 15, 'mult': 2},
  'straight':       {'chip': 30, 'mult': 3},
  'straightFlush':  {'chip': 40, 'mult': 4},
  'royalFlush':     {'chip': 40, 'mult': 4},
}
*/

/** Runs through the records created during scorePhase.
 * updates the RoundStatus scoring numbers. */
function updateScore(
  roundStatus:RoundStatus,
  playedRecord:ScoreChange[],
  unplayedRecord:ScoreChange[],
  jokerRecord:ScoreChange[]){

  let roundUpdated = structuredClone(roundStatus);

  let allRecords = [playedRecord, unplayedRecord, jokerRecord];
  for (let records of allRecords){
    for (let record of records){
      let {id, value, change} = record;
      if (change === 'chip'){
        roundUpdated.chip = roundUpdated.chip + value;
      } else if (change === 'mult'){
        roundUpdated.mult = roundUpdated.mult + value;
      } else if (change === 'multTimes'){
        roundUpdated.mult = roundUpdated.mult * value;
      }
    }
  }

  return roundUpdated;
}

/** controller function.
 * Goal is to run several scoring sub functions, then
 * create a set of records. These records will run through
 * updating the score as it goes, in order, executes:
 * preScore
 */
function scorePhase(deckStats:DeckStatus,
  runStats:RunStatus,
  roundStats:RoundStatus){


  //preScore(hand, jokers) //eg, convert cards to gold/strip enhancements

  //scorePlayed() //checks hand, creates playedRecord
  let playedRecord = scorePlayed(deckStats.playedCards, runStats.jokers);
  for (let scoreChange of playedRecord){
    let {change, value} = scoreChange;
    if (change === 'chip') roundStats.chip += value;
    else if (change === 'mult') roundStats.mult += value;
    else if (change === 'multTimes') roundStats.mult *= value;
  }

  //scoreUnplayed() //Steel triggers + Red Seals
  let unplayedRecord = scorePlayed(deckStats.playedCards, runStats.jokers);
  for (let scoreChange of unplayedRecord){
    let {change, value} = scoreChange;
    if (change === 'chip') roundStats.chip += value;
    else if (change === 'mult') roundStats.mult += value;
    else if (change === 'multTimes') roundStats.mult *= value;
  }

  //scoreJokers() //pair/flush bonuses
  let jokerRecord = scoreJokers(deckStats.playedCards, runStats.jokers);
  for (let scoreChange of jokerRecord){
    let {change, value} = scoreChange;
    if (change === 'chip') roundStats.chip += value;
    else if (change === 'mult') roundStats.mult += value;
    else if (change === 'multTimes') roundStats.mult *= value;
  }
}
/**
 The specific order is:

    Adding Base Card Chips

    Triggering Own Card Effects: +Chips (either from Bonus as +30 chips,
    or from Hiker), Mult card (+4 Mult), Lucky (Chances of +20 mult or $20).
    Triggering Card Editions: Foil (+50 chips), Holographic (+10 Mult)
    or Polychrome (1.5 xMult).
    Triggering Joker Effects: Fibonacci, Photograph, Smiley, Greedy Joker
    adds +4 Mult on Diamonds, etc.
    Also, here's where Hiker adds the Chips to the card,
    that's why they are not counted but until the next time the cards are dealt.
    Gold Seal, if card has one. It will give $3 after played.

    Finally, retriggers (red seal, hack) can happen.
 */
function scorePlayed(cards: Card[], jokers: Joker[]){
  let playedRecord: ScoreChange[] = [];

  const jokerFns = findActiveJokers(jokers, 'scorePlayed');
  const checkResult = checkAllHands(cards);
  const {bestHand} = checkResult;
  const isScored = checkResult['scoredCards'][bestHand];


  for (let i = 0; i < cards.length; i++){
    let card = cards[i];
    if (isScored[i] || card['enhanced'] === 'stone'){
      //score cards
      let recordSegment = scorePlayedCard(card, i);

      //add joker bonuses
      for (let jokerFn of jokerFns){
        let bonus = jokerFn(card); //returns {chip: 0, mult: 0, multTimes: 0}
        for (let key in bonus){
          if (bonus[key] > 0){
            let scoreChange = {id: i, value: bonus[key], change: key} as ScoreChange;
            recordSegment.push(scoreChange);
          }
        }
      }

      //retrigger
      if (card.seal === 'red') recordSegment = [...recordSegment, ...recordSegment];
      playedRecord = [...playedRecord, ...recordSegment];
    }
  }

  return playedRecord;
}
/** helper function for scorePlayed, builds the record segment for an
 * individual card that should be scored.
 * Expects scored===true, and requires a card + id as parameters. */
function scorePlayedCard(card: Card, id:number){
  let playedRecord = [];
  let scoreChange;

  if (card.enhanced === 'stone'){
    scoreChange = {id, value: 50, change: 'chip'} as ScoreChange;
  } else {
    scoreChange = {id, value: card.chip, change: 'chip'} as ScoreChange;
  }

  //chips done all in one, so before pushing add modifiers due to bonus/foil
  if (scoreChange){
    //chips
    if (card['enhanced'] === 'bonus') scoreChange['value'] += 30;
    if (card['special'] === 'foil') scoreChange['value'] += 50;
    playedRecord.push(scoreChange);

    //mult
    scoreChange = {id, value: 0, change: 'mult'} as ScoreChange;
    if (card['enhanced'] === 'mult') scoreChange['value'] += 4;
    if (scoreChange['value'] > 0) playedRecord.push(scoreChange);

    scoreChange = {id, value: 0, change: 'mult'} as ScoreChange;
    if (card['special'] === 'holo') scoreChange['value'] += 10;
    if (scoreChange['value'] > 0) playedRecord.push(scoreChange);

    //multTimes
    scoreChange = {id, value: 0, change: 'multTimes'} as ScoreChange;
    if (card['enhanced'] === 'glass') scoreChange['value'] = 2;
    if (scoreChange['value'] > 0) playedRecord.push(scoreChange);

    scoreChange = {id, value: 0, change: 'multTimes'} as ScoreChange;
    if (card['special'] === 'poly') scoreChange['value'] = 1.5;
    if (scoreChange['value'] > 0) playedRecord.push(scoreChange);
  }

  return playedRecord;
}


/** Check held cards for steel (+red seal). Does not check for blue seal */
function scoreUnplayed(cards: Card[], jokers: Joker[]){
  let unplayedRecord: ScoreChange[] = [];

  //Check for steel cards/red seal
  for (let i = 0; i < cards.length; i++){
    let card = cards[i];
    if (card.enhanced === 'steel'){
      let scoreChange = {id: i, value: 1.5, change: 'multTimes'} as ScoreChange;
      unplayedRecord.push(scoreChange);
      if (card.seal === 'red') unplayedRecord.push(scoreChange);
    }
  }

  return unplayedRecord;
}


function scoreJokers(cards: Card[], jokers: Joker[]){
  let jokerRecord: ScoreChange[] = [];
  const checkResult = checkAllHands(cards);

  //convoluted, but necessary to get index
  for (let i = 0; i < jokers.length; i++){
    const jokerFns = findActiveJokers([jokers[i]], 'scoreJokers');

    if (jokerFns.length > 0){
      let bonus = jokerFns[0](checkResult); //returns {chip: 0, mult: 0, multTimes: 0}
      for (let key in bonus){
        if (bonus[key] > 0){
          let scoreChange = {id: i, value: bonus[key], change: key} as ScoreChange;
          jokerRecord.push(scoreChange);
        }
      }
    }
  }

  return jokerRecord;
}





// type ScoreRecord = {
//   handScore: number,
//   roundScore: number,
//   playedRecord: ScoreChange[],
//   unplayedRecord: ScoreChange[],
//   jokerRecord: ScoreChange[],
// }

//how to handle pre-scoring jokers like midas
//could have separation:
//in demo
//playHand
  //pre-score mods (midas, vampire)
  //scoreHand
  //post-score mods.


