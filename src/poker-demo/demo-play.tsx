import {checkStraight, checkFlush} from '../helpers/check';
import { buildStartDeck } from '../helpers/misc';


//Setup game
const handBase = 5;
const discardBase = 4;
const handSizeBase = 8;
let roundGoals = [300, 450, 600];


let myDeck = buildStartDeck();


//play Game
function playGame(){
  let currRound = 0;
  let score: number;
  let lost = false;
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

function playRound(){
  let handsLeft = handBase;
  let discardsLeft = discardBase;
  let deckRemaining = myDeck;
  let roundScore = 0;

  let myCards = deckRemaining.splice(0, handSizeBase);
  //FIXME: add sensible return
  return roundScore;
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