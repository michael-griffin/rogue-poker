import {checkFlush} from '../helpers/check';
import {
  getRankInfo,
  buildSimpleDeck,
  buildStartDeck,
  findCards
} from '../helpers/misc';

//create simple deck
const simpleDeck = buildSimpleDeck();
const basicDeck = buildStartDeck();






//Test Flush
describe('checkFlush', function() {
  //filter deck to cards of 1 suit, pull 5 cards of that suit
  const handSpades = findCards('suit', 'spade', simpleDeck);
  const handHearts = findCards('suit', 'heart', simpleDeck);
  const handClubs = findCards('suit', 'club', simpleDeck);
  const handDiamonds = findCards('suit', 'diamond', simpleDeck);
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



