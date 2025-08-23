import {
  RunStatus,
  RoundStatus,
  CardDeck
} from '../../types/misc';

import { baseHandSize, scoreGoals } from '../constants';

export function buildRunStatus(
  difficulty: 'normal'|'hard'|'hell'='normal',
  hands=4, discards=3, startMoney=4,
  handSize=baseHandSize
): RunStatus {

  const newStatus = {
    jokers: [],
    hands,
    discards,
    handSize,

    currentRound: 1,
    currentAnte: 1,
    currentMoney: startMoney,
    scoreGoals: scoreGoals[difficulty],
    skipTag: null,

    vouchers: [],
    inventory: [],
    lastUsed: null,
    handRecord: buildHandRecord(),
  }

  return newStatus;
}
export function buildHandRecord(){
  const handRecord = {
    highCard:       {play: 0, level: 0},
    pair:           {play: 0, level: 0},
    threeOf:        {play: 0, level: 0},
    fourOf:         {play: 0, level: 0},
    fiveOf:         {play: 0, level: 0},
    flushFive:      {play: 0, level: 0},
    twoPair:        {play: 0, level: 0},
    fullHouse:      {play: 0, level: 0},
    flushHouse:     {play: 0, level: 0},
    flush:          {play: 0, level: 0},
    straight:       {play: 0, level: 0},
    straightFlush:  {play: 0, level: 0},
    royalFlush:     {play: 0, level: 0},
  };

  return handRecord;
}