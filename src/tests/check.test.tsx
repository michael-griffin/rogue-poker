import {describe, test, expect} from 'vitest';
import {
  checkHighCard,
  checkPairToFive,
  checkFlush,
  checkStraight
} from '../helpers/check';
import {
  getRankInfo,
  findCards,
  makeCard,
  makeSimpleCards,
  makeStandardCards,
} from '../helpers/cards/cards';
import {
  fourFingers,
  shortcut
} from '../helpers/cards/jokers';

import {
  Card,
  HandTypes,
  CheckResult,
} from '../types/misc';


//create simple deck
const simpleCards = makeSimpleCards();
const standardCards = makeStandardCards();
const spades = findCards(standardCards, 'suit', 'spades');

describe('test straights', function(){
  let fourGap:Card[] = [spades[0], spades[1], spades[2], spades[4]]; //Ace 2 3 5
  let fiveGap:Card[] = [...fourGap, spades[6]]; //Ace 2 3 5 7
  //Ace King Queen Jack and (sometimes) 10
  let fourAceHigh:Card[] = [spades[0], spades[10], spades[11], spades[12]];
  let fiveAceHigh:Card[] = [spades[0], spades[9], spades[10], spades[11], spades[12]];
  let fourAceHighExtra:Card[] = [...fourAceHigh, spades[5]];
  let fiveAceWrapFail:Card[] = [spades[0], spades[1], spades[2], spades[11], spades[12]];
  let fourStandard:Card[] = [spades[4], spades[5], spades[6], spades[7]]; //5 6 7 8
  let fiveStandard:Card[] = [...fourStandard, spades[8]]; //5 6 7 8 9
  let threeFail:Card[] = [spades[0], spades[1], spades[2]]; //Ace 2 3
  let fourFail:Card[] = [...threeFail, spades[5]]; //Ace 2 3 6
  let fiveFail:Card[] = [...threeFail, spades[5], spades[12]]; //Ace 2 3 6 King

  test.skip('standard, no gaps/jokers', function(){
    const resultThree = checkStraight(threeFail);
    const resultFour = checkStraight(fourStandard);
    const resultFive = checkStraight(fiveStandard);

    //let {match, handType, scoredCards} = result;
    expect(resultThree.match).toEqual(false);
    expect(resultThree.handType).toEqual('straight');
    expect(resultThree.scoredCards).toEqual([false, false, false]);

    expect(resultFour.match).toEqual(false);
    expect(resultFour.scoredCards).toEqual([false, false, false, false]);

    expect(resultFive.match).toEqual(true);
    expect(resultFive.handType).toEqual('straight');
    expect(resultFive.scoredCards).toEqual([true, true, true, true, true])
  })
  test('Ace High', function(){

    const resultFive = checkStraight(fiveAceHigh);
    const resultFourFail = checkStraight(fourAceHigh);
    const resultFiveFail = checkStraight(fiveAceWrapFail);

    expect(resultFive.match).toEqual(true);
    expect(resultFive.handType).toEqual('straight');
    expect(resultFive.scoredCards).toEqual([true, true, true, true, true])

    expect(resultFourFail.match).toEqual(false);
    expect(resultFourFail.scoredCards).toEqual([false, false, false, false]);

    expect(resultFiveFail.match).toEqual(false);
    expect(resultFiveFail.scoredCards).toEqual([false, false, false, false, false]);
  })
  test('shortcut and fourFingers jokers', function(){
    const resultFour = checkStraight(fourStandard, [fourFingers]);
    const resultFourAce = checkStraight(fourAceHigh, [fourFingers]);
    const resultFourGap = checkStraight(fourGap, [fourFingers, shortcut]);
    const resultFiveGap = checkStraight(fiveGap, [shortcut]);

    const resultFourExtra = checkStraight(fourAceHighExtra, [fourFingers]);

    const resultFourFail = checkStraight(fourFail, [fourFingers, shortcut]);
    const resultFiveFail = checkStraight(fiveFail, [fourFingers, shortcut]);

    expect(resultFour.match).toBe(true);
    expect(resultFourAce.match).toBe(true);
    expect(resultFourGap.match).toBe(true);
    expect(resultFiveGap.match).toBe(true);
    expect(resultFourExtra.match).toBe(true);
    expect(resultFourExtra.scoredCards).toEqual([true, true, true, true, true]);
    expect(resultFourFail.match).toBe(false);
    expect(resultFiveFail.match).toBe(false);
  })
})


/** scoringHand changed to scoredCards. these tests are PROBABLY different now. */
//test pair to five
describe('check high card to five', function() {
  const handTwos = findCards(simpleCards, 'rank', 2);
  let twoSpades = makeCard(2, 'spades');
  handTwos.push(twoSpades);

  let threeSpades = makeCard(3, 'spades');
  const handThreeHigh = [...handTwos];
  handThreeHigh[4] = threeSpades;

  test('pair', function() {
    //match = true, handtype = 'pair', scoredCards two t
    const result = checkPairToFive(handTwos, 2);
    let {match, handType, scoredCards} = result;
    expect(match).toEqual(true);
    expect(handType).toEqual('pair');
    //expect(scoredCards.length).toEqual(2);
  })
  test('three of a kind', function() {
    const result = checkPairToFive(handTwos, 3);
    let {match, handType, scoredCards} = result;
    expect(match).toEqual(true);
    expect(handType).toEqual('threeOf');
    //expect(scoringHand.length).toEqual(3);
  })
  test('four of a kind', function() {
    const result = checkPairToFive(handTwos, 4);
    let {match, handType, scoredCards} = result;
    expect(match).toEqual(true);
    expect(handType).toEqual('fourOf');
    //expect(scoringHand.length).toEqual(4);
  })
  test('five of a kind', function() {
    const result = checkPairToFive(handTwos, 5);
    let {match, handType, scoredCards} = result;
    expect(match).toEqual(true);
    expect(handType).toEqual('fiveOf');
    //expect(scoringHand.length).toEqual(5);
  })

  test('high card', function() {
    const result = checkHighCard(handThreeHigh);
    let {match, handType, scoredCards} = result;
    expect(match).toEqual(true);
    expect(handType).toEqual('highCard');
    //expect(scoringHand.length).toEqual(1);
    //expect(scoringHand[0].rank).toEqual(3);
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
  const handSpades = findCards('suit', 'spades', simpleCards);
  const handHearts = findCards('suit', 'hearts', simpleCards);
  const handClubs = findCards('suit', 'clubs', simpleCards);
  const handDiamonds = findCards('suit', 'diamonds', simpleCards);
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