import {describe, test, expect} from 'vitest';
import {checkHighCard, checkPairToFive, checkFlush} from '../helpers/check';
import {
  getRankInfo,
  makeCard,
  enhanceCard,
  buildSimpleDeck,
  buildStartDeck,
  findCards
} from '../helpers/misc';

//create simple deck
const simpleDeck = buildSimpleDeck();
const basicDeck = buildStartDeck();



//test pair to five
describe('check high card to five', function() {
  const handTwos = findCards('rank', 2, simpleDeck);
  let twoSpades = makeCard(2, 'spades');
  handTwos.push(twoSpades);

  let threeSpades = makeCard(3, 'spades');
  const handThreeHigh = [...handTwos];
  handThreeHigh[4] = threeSpades;

  test('pair', function() {
    //match = true, handtype = 'pair', scoringHand length = 2
    const result = checkPairToFive(handTwos, 2);
    let {match, handType, scoringHand} = result;
    expect(match).toEqual(true);
    expect(handType).toEqual('pair');
    expect(scoringHand.length).toEqual(2);
  })
  test('three of a kind', function() {
    const result = checkPairToFive(handTwos, 3);
    let {match, handType, scoringHand} = result;
    expect(match).toEqual(true);
    expect(handType).toEqual('threeOf');
    expect(scoringHand.length).toEqual(3);
  })
  test('four of a kind', function() {
    const result = checkPairToFive(handTwos, 4);
    let {match, handType, scoringHand} = result;
    expect(match).toEqual(true);
    expect(handType).toEqual('fourOf');
    expect(scoringHand.length).toEqual(4);
  })
  test('five of a kind', function() {
    const result = checkPairToFive(handTwos, 5);
    let {match, handType, scoringHand} = result;
    expect(match).toEqual(true);
    expect(handType).toEqual('fiveOf');
    expect(scoringHand.length).toEqual(5);
  })

  test('high card', function() {
    const result = checkHighCard(handThreeHigh);
    let {match, handType, scoringHand} = result;
    expect(match).toEqual(true);
    expect(handType).toEqual('highCard');
    expect(scoringHand.length).toEqual(1);
    expect(scoringHand[0].rank).toEqual(3);
  })
})


describe('check two pair and full house', function(){

  let kingHearts = makeCard(13, 'hearts');
  let kingHeartsTwo = makeCard(13, 'hearts');
  let kingHeartsThree = makeCard(13, 'hearts');
  let queenHearts = makeCard(12, 'hearts');
  let queenHeartsTwo = makeCard(12, 'hearts');
  let queenSpades = makeCard(12, 'spades');
  let jackSpades = makeCard(11, 'spades');

  const handFlushHouse = [kingHearts, kingHeartsTwo, kingHeartsThree,
    queenHearts, queenHeartsTwo];
  const handFullHouse = handFlushHouse;
  handFullHouse[4] = queenSpades;
  const handTwoPair = handFlushHouse;
  handTwoPair[2] = jackSpades;

  test('two pair', function() {

  })
  test('full house', function() {

  })
  test('flush house', function() {

  })
})


/*
//Test Flush
describe('checkFlush', function() {
  //filter deck to cards of 1 suit, pull 5 cards of that suit
  const handSpades = findCards('suit', 'spades', simpleDeck);
  const handHearts = findCards('suit', 'hearts', simpleDeck);
  const handClubs = findCards('suit', 'clubs', simpleDeck);
  const handDiamonds = findCards('suit', 'diamonds', simpleDeck);
  //Does it record a flush for each of the 4 suits?

  test('5 hand flush found', function() {
    const spadeMatch = checkFlush(handSpades);
    let matchResult = {
      scoredCards: [...handSpades],
      isFlush: true
    };
    expect(spadeMatch).toEqual(matchResult);

    //FIXME: repeat for other suits
  })

  //does it record a flush when minSize = 4?
  test('4 card flush found', function () {

  })
})

*/