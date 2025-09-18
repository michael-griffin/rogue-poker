import { buyItem, stockShop } from '../helpers/actions/shop';
import { buildRunStatus } from '../helpers/actions/run';
import { buildRoundStatus, finishRound } from '../helpers/actions/round';
import {
  buildCardDeck,
  selectCards,
  dealCards,
  discardCards,
  playCards
} from '../helpers/cards/cards';
import {checkStraight, checkFlush} from '../helpers/check';
import {
  shuffle,
  chooseRandom,
 } from '../helpers/actions/misc';
import {
  CardDeck,
  RunStatus,
  RoundStatus,
} from '../types/misc';



import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const readline = require('readline-sync');


let myDeck = buildCardDeck();



//play Game
function playGame() {
  let {cardDeck, runStatus, roundStatus} = setupStart();

  let shopResult = goShopping(cardDeck, runStatus);
  //console.log(shopResult);
  return;
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
    let roundResults = playRound(cardDeck, runStatus, roundStatus, instructions);
    cardDeck = roundResults.cardDeck;
    runStatus = roundResults.runStatus;
    roundStatus = roundResults.roundStatus;
  } else {
    //increment round, handle skipBonus.
  }

  //Go to Shop

  //Prepare for next round
}

/**
 * build cardDeck
 * build RunStatus
 * build RoundStatus
 * FOR THE FUTURE:
 * - difficulties: could switch parameters in runStatus. Eg., starting money.
 * - multiple decks
 */
function setupStart(difficulty:'normal'|'hard'|'hell'='normal') {

  const baseDeck = buildCardDeck();
  const baseRun = buildRunStatus();
  const baseRound = buildRoundStatus();

  return {
    cardDeck: baseDeck,
    runStatus: baseRun,
    roundStatus: baseRound,
  }
}


//number[] are the indices of cards to discard or play
//buildRoundInstructions makes n of these
type RoundInstruction = ['discard'|'play', number[]];
/**
 *
 */
function playRound(baseDeck:CardDeck,
  baseRun:RunStatus,
  baseRound:RoundStatus,
  instructions:RoundInstruction[]){

  let currentDeck:CardDeck = structuredClone(baseDeck);
  let currentRun:RunStatus = structuredClone(baseRun);
  let currentRound:RoundStatus = structuredClone(baseRound);

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
    //TODO: score cards, check if score exceeds goal for round.
  }

  //TODO: handle game over, ideally run/roundStatus should provide info for
  //game over screen.

  //finish Round
  let roundResults = finishRound(currentDeck, currentRun, currentRound);
  return roundResults; //cardDeck, runStatus, roundStatus
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







//TODO: shopping instructions on how to select, reroll? How to interface
//with shelves?
function goShopping(baseDeck:CardDeck, baseRun:RunStatus){ //, instructions:any[])

  let currentDeck = structuredClone(baseDeck);
  let currentRun = structuredClone(baseRun);
  console.log('current Run: ', currentRun);

  //Stock shop
  let newStock = stockShop(currentRun);
  console.log(newStock);
  console.log(newStock.shelf[0])
  //(while loop) buy item or end shopping

  console.log('would you like to buy an item?' )
  let resp = readline.question("Enter y/n \n");

  if (resp === 'n'){
    console.log('alright, ending shopping');
  } else {
    let resp:'shelf'|'vouchers'|'packs' = readline.question(
      'Buy from shelf, vouchers, or packs?\n');
    while (!['shelf','vouchers','packs'].includes(resp)){
      resp = readline.question("please enter 'shelf', 'vouchers', or 'packs'\n");
    }
    let area = resp;
    resp = readline.question('Which position? 0 or 1\n');

    let ind = +resp;

    let item = newStock[area][ind];
    let result = buyItem(currentDeck, currentRun, item);

  }
  //how to open packs?
  return {
    cardDeck: currentDeck,
    runStatus: currentRun,
  }
}


playGame();

//start round (shuffle deck)
//draw hand
//select 1-5 cards (may need to have an order shuffle test here)
//play hand
  //score it (check if score exceeds roundGoal)
//draw new hand
//select 1-5 cards
//discard + redraw
//play 2nd hand + add to score