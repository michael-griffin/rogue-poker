import {
  RunStatus,
  RoundStatus,
  CardDeck
} from '../../types/misc';

import { resetDeck } from '../cards/cards';
import { findActiveJokers } from '../cards/jokers';

export function buildRoundStatus(handsLeft=4, discardsLeft=3): RoundStatus {
  const newStatus = {
    handsLeft,
    discardsLeft,
    scoreForRound: 0,
    chip: 0,
    mult: 0,
  }

  return newStatus;
}

export function finishRound(baseDeck:CardDeck,
  baseRun:RunStatus,
  baseRound:RoundStatus) {

  let currentDeck:CardDeck = structuredClone(baseDeck);
  let currentRun:RunStatus = structuredClone(baseRun);
  let currentRound:RoundStatus = structuredClone(baseRound);

  //reset deck
  let cleanDeck = resetDeck(currentDeck);

  const jokerFns = findActiveJokers(currentRun['jokers'], 'roundEnd');
  //update egg, destroy banana, cash in from cloud9/rocket ship.


  //Update Money
  const moneyForHands = currentRound['handsLeft'];
  const moneyForInterest = Math.floor(currentRun['currentMoney'] / 5);
  currentRun['currentMoney'] += moneyForHands + moneyForInterest;


  //build new roundStatus
  let cleanRoundStats = buildRoundStatus(currentRun['hands'], currentRun['discards']);


  return {
    cardDeck: cleanDeck,
    runStatus: currentRun,
    roundStatus: cleanRoundStats,
  }
}
