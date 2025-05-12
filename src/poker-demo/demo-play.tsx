import {checkStraight, checkFlush} from '../helpers/check';
import {
  buildRunStatus,
  buildRoundStatus,
  buildDeckStatus,
  buildStartDeck,
 } from '../helpers/misc';
import {
  DeckStatus,
  RunStatus,
  RoundStatus,
} from '../types/misc';

//Setup game
const handBase = 4;
const discardBase = 3;
const handSizeBase = 8;


let myDeck = buildStartDeck();



//play Game
function playGame() {
  let {deckStatus, runStatus, roundStatus} = setupStart();

  //check currentRound (0 -> small, 1-> big, 2 -> boss.
  //play blind or skip
  let currentRound = runStatus.currentRound;
  let currentBlind = currentRound % 3;
  let playBind = true;
  if ( currentRound === 0 || currentBlind === 1){
    playBind = true; //or false, could skip here.
  }

  if (playBind){
    let roundResults = playRound(deckStatus, runStatus, roundStatus);
    deckStatus = roundResults.deckStatus;
    runStatus = roundResults.runStatus;
    roundStatus = roundResults.roundStatus;
  } else {
    //increment round, handle skipBonus.
  }

  //Go to Shop



  for (let roundGoal of roundGoals){
    score = playRound();
    if (score < roundGoal){
      lost = true;
      break;
    }
  }
  if (lost){
    console.log('oops');
  } else {
    console.log('hurray');
  }
}

/**
 * build a deck, then build deckStatus
 * build RunStatus
 * build RoundStatus
 * FOR THE FUTURE: different difficulties could switch
 * parameters in deck/run status. Eg., starting money.
 * Could do something similar with deck choice
 */
function setupStart(difficulty:'normal'|'hard'|'hell'='normal') {

  const baseDeckStatus = buildDeckStatus();
  const baseRunStatus = buildRunStatus();
  const baseRoundStatus = buildRoundStatus();

  return {
    deckStatus: baseDeckStatus,
    runStatus: baseRunStatus,
    roundStatus: baseRoundStatus,
  }
}


function playRound(deckStatusStart:DeckStatus,
  runStatusStart:RunStatus,
  roundStatusStart:RoundStatus){

  //increment Round

  //deal starting hand

  //interface with player?
  //player must select, then discard or play, how are these commands given?
  //round must continue until score is reached or hands played = 0.

  return {
    deckStatus: deckStatusStart,
    runStatus: runStatusStart,
    roundStatus: roundStatusStart,
  }
}






//start round (shuffle deck)
//draw hand
//select 1-5 cards (may need to have an order shuffle test here)
//play hand
  //score it (check if score exceeds roundGoal)
//draw new hand
//select 1-5 cards
//discard + redraw
//play 2nd hand + add to score