/*
https://www.reddit.com/r/balatro/comments/1blbexa/detailed_break_down_of_balatro_scoring_system_and/

https://balatrogame.fandom.com/wiki/Poker_Hands
https://balatrogame.fandom.com/wiki/Planet_Cards
*/

import { allJokerFunctions } from "./jokers";

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

/** controller function, in order, executes:
 * preScore
 */
function playHand(){

  //preScore(hand, jokers)

  //scoreHand()

  //scoreUnplayed() (Steel triggers))

  //scoreJokers()

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
function scoreHand(hand: Card[], jokers: Joker[]){
  //For scoring hand
  //check each card and update chip x mult
    //if card is +30 chips, only increase chips once (ace would be one case of +41)
    //mult comes after chips
    //jokers come after card evaluation
  const jokerFns = [];
  for (let joker of jokers){

  }

  const chipIncreases = [];
  const multIncreases = [];
  for (let card of hand){

  }

}

//how to handle pre-scoring jokers like midas
//could have separation:
//in demo
//playHand
  //pre-score mods (midas, vampire)
  //scoreHand
  //post-score mods.