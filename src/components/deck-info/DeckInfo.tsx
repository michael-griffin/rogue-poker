import './DeckInfo.css'; //styles from

import { Suit } from '../../types/misc';
import {buildSimpleDeck, findCards} from '../../helpers/cards/cards';
import { rankNames } from '../../helpers/constants';

//TODO: update so deck is imported with props rather than using a
//prebuilt placeholder



//const myDeck = buildStartDeck();
const myDeck = buildSimpleDeck();

function DeckInfo(){


  function makeCardListsJSX(){
    const fullContainer = [];
    const suits:Suit[] = ['spades', 'hearts', 'clubs', 'diamonds'];

    for (let suit of suits){
      const cards = findCards(myDeck, 'suit', suit);
      const cardsJSX = cards.map((card, ind) => {
        const {rank, suit} = card;
        const rankName = rankNames[rank];
        const cardJSX = <div className="card-container">
          <img className="card-img" src={`cards/${rankName}-${suit}.png`} />
        </div>;
        return cardJSX;
      });

      const rowJSX = <div className="row">{cardsJSX}</div>;
      fullContainer.push(rowJSX);
    }
    return fullContainer;
  }



  function makeRankCountsJSX(){
    const ranks = [1, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    const rankLabels = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    const countsJSX = [];
    for (let i = 0; i < ranks.length; i++){
      let currCount = 4; //FIXME: update to use findCards, search by ranks[i]

      let countJSX = <div className="count-container">
        <div className="rank-label">
          <div className="label-text">{rankLabels[i]}</div>
        </div>
        <div className="rank-count">{currCount}</div>
      </div>
      countsJSX.push(countJSX);
    }
    return countsJSX;
  }


  return (
    <div className="deckinfo-area">
      <div className="deckinfo-top">
        <div className="deck-button">Deck</div>
      </div>
      <div className="deckinfo-middle" >
        <aside className="middle-left">
          <div className="left-summary">
            <div className="decktype">
              <div className="decktype-name">Deck Name</div>
              <div className="decktype-infobox">Info textbox</div>
            </div>
            <div className="cardtype-counts">
              <div>Base Cards</div>

              {/* Base - ace:4 face:14 num:38
              spade, heart, club diamond counts*/}
            </div>
          </div>
          <div className="rank-counts">
            {/* <div className="count-container">
              <div className="rank-label"><div className="label-text">A</div></div>
              <div className="rank-count">4</div>
            </div>
            <div className="count-container">
              <div className="rank-label">10</div>
              <div className="rank-count">3</div>
            </div> */}
            {makeRankCountsJSX()}
          </div>
        </aside>
        <main className="allcards">
          {makeCardListsJSX()}
        </main>
      </div>
      <footer className="deckinfo-bottom">

      </footer>
    </div>
  )
}

export default DeckInfo;