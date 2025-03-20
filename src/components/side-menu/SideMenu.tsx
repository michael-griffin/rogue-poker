
/**
 * SideMenu will need scoring information and cardIf so, requires access to
 * a child's state, which is a little tricky. Might be able to sidestep if
 * we send on a simplified (current mult addition, current point addition, etc)
 */

import './SideMenu.css';

// type SideMenuProps = {

// }
function SideMenu(){

  const currentStage = 'blind'; //blind, round, shop

  function createTopJSX(currentStage: string): JSX.Element {
    let topJSX;
    if (currentStage === "blind"){
      topJSX = <div className="top-blind">
        <div className="top-blind-text-1">Choose your</div>
        <div className="top-blind-text-2">next Blind</div>
      </div>
    } else if (currentStage === "shop"){

    } else if (currentStage === "round") {

    } else {
      topJSX = <div>ERROR</div>;
    }
    return topJSX as JSX.Element;
  }

  let sideTopJSX = createTopJSX('blind');

  return (
    <aside className="side-menu">
      <section className="side-top">
        {sideTopJSX}
      </section>

      <section className="side-middle">

      </section>
      <section className="side-bottom">
        <div className="bottom-buttons">
          <div className="button-runinfo">Run Info</div>
          <div className="button-options">Options</div>
        </div>
        <div className="bottom-roundinfo">
          <div className="roundinfo-top">
            <div className="roundinfo-hands">

            </div>
            <div className="roundinfo-discards">
              <div>Discards</div>

            </div>
          </div>
        </div>
        <div className="roundinfo-mid">$9</div>
        <div className="roundinfo-bottom">

        </div>
      </section>
    </aside>
  )
}

export default SideMenu;