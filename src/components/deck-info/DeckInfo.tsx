import {buildSimpleDeck, findCards} from '../../types/misc-functions';

//TODO: update so deck is imported with props rather than using a
//prebuilt placeholder



//const myDeck = buildStartDeck();
const myDeck = buildSimpleDeck();

function DeckInfo(){


  function makeCardListsJSX(){
    let spadesCards = findCards('suit', 'spades', myDeck);
    let heartsCards = findCards('suit', 'hearts', myDeck);
    let clubsCards = findCards('suit', 'clubs', myDeck);
    let diamondsCards = findCards('suit', 'diamonds', myDeck);


    let spadesCardsJSX = spadesCards.map((card, ind) => {
      const {rank:cardRank, suit:cardSuit} = card;
      return <img className="row-card" src={`cards/${cardRank}-${cardSuit}`} />
    });

    let fullContainer = <div className="">
      <div className="row-spades">{spadesCardsJSX}</div>

    </div>
  }

  function makeRankCountsJSX(){
    let ranks = [1, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    let rankLabels = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

  }

  return (
    <div className="deck-info-area">
      <div className="top-buttons">
        <div className="deck-button">Deck</div>
        <div className="vouchers-button">Vouchers</div>
        <div className="poker-hands-button">Poker Hands</div>
        <div className="blinds-button">Blinds</div>
      </div>
      <div className="middle-outer" >
        <aside className="middle-left-info">
          <div className="left-summary">

          </div>
          <div className="left-rank-counts">

          </div>
        </aside>
        <div className="middle-main">

        </div>
      </div>
      <footer>

      </footer>
    </div>
  )
}

export default DeckInfo;