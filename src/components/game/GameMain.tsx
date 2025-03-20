/**
 * Game is the main hub after a deck has been selected.
 * Component Flow
 *
 * App -> Game -> Stage/Round/Shop
 */

import './GameMain.css'
import StageSelect from '../stage/StageSelect';
import Shop from '../shop/Shop';
import SideMenu from '../side-menu/SideMenu';

function GameMain(){

  return (
    <div className="fullbody">
      <SideMenu />
      <main>
        <div className="joker-section"></div>
        <div className="consumable-section"></div>
        <div className="center-section">
          {/* <StageSelect /> */}
          <Shop />
        </div>
        {/* <div className="StageSelect"></div>  */}
        {/* Switch out with Round or Shop */}
        <div className="deck-section"></div>
      </main>
    </div>
  )
}


export default GameMain;


// return (
//   <div className="fullbody">
//     <SideMenu />
//     <main>
//       <div className="top-section">
//         <JokerSection />
//         <ConsumableSection />
//       </div>
//       <div className="bottom-section">
//         <StageSelect /> {/* Switch out with Round or Shop */}
//         <DeckSection />
//       </div>
//     </main>
//   </div>
// )