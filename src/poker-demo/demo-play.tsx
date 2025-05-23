import {checkStraight, checkFlush} from '../helpers/check';
import {
  buildRunStatus,
  buildRoundStatus,
  buildDeckStatus,
  buildStartDeck,
  selectCards,
  dealCards,
  discardCards,
  playCards,
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
    let instructions = buildRoundInstructions();
    let roundResults = playRound(deckStatus, runStatus, roundStatus, instructions);
    deckStatus = roundResults.deckStatus;
    runStatus = roundResults.runStatus;
    roundStatus = roundResults.roundStatus;
  } else {
    //increment round, handle skipBonus.
  }

  //Go to Shop

  //Prepare for next round
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


//number[] are the indices of cards to discard or play
//buildRoundInstructions makes n of these
type RoundInstruction = ['discard'|'play', number[]];
/**
 *
 */
function playRound(deckStatusStart:DeckStatus,
  runStatusStart:RunStatus,
  roundStatusStart:RoundStatus,
  instructions:RoundInstruction[]){

  let currentDeck:DeckStatus = structuredClone(deckStatusStart);
  let currentRun:RunStatus = structuredClone(runStatusStart);
  let currentRound:RoundStatus = structuredClone(roundStatusStart);

  //increment Round
  currentRun.currentRound = currentRun.currentRound + 1;

  //deal starting hand
  currentDeck = dealCards(currentDeck, currentRun.handSize);


  //Loop through RoundInstructions
  for (let i = 0; i < instructions.length; i++){
    let [playDiscard, indices] = instructions[i];

    currentDeck = selectCards(currentDeck, indices);
    if (playDiscard === 'discard') {
      if (currentRound.discardsLeft === 0){
        console.log('skipped discard, none remaining');
        continue;
      }

      currentDeck = discardCards(currentDeck);
      currentRound.discardsLeft--;
      continue;

    } else { //play cards
      currentDeck = playCards(currentDeck);
      //score cards
    }

  }



  return {
    deckStatus: deckStatusStart,
    runStatus: runStatusStart,
    roundStatus: roundStatusStart,
  }
}


//type RoundInstruction = ['discard'|'play', number[]];
/** builds an array of round instructions
 * can be play only or a mix of play/discard
 * select size is an array that contains allowed select sizes:
 * [1, 5] would have either 1 or 5 cards selected
*/
function buildRoundInstructions(playOnly=true, len=4, selectSize=5){
  const instructions:RoundInstruction[] = [];

  for (let i = 0; i < len; i++){
    let indices = chooseRandom(selectSize);
    let playDiscard:'play'|'discard' = 'play';
    if (!playOnly && Math.round(Math.random())) playDiscard = 'discard';

    instructions.push([playDiscard, indices] as RoundInstruction);
  }

  return instructions;
}
/** choose <count> random indices between 0 and handSize-1 */
function chooseRandom(count:number){
  let allIndices = Array(handSizeBase).fill(-1).map((_, ind) => ind);

  function shuffle(base:number[]) {
    let arr = structuredClone(base);
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return base;
  }
  let indices = shuffle(allIndices).slice(0,count);
  return indices;
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