
import './StageSelect.css';


/**
 * TODO: To check: what controls the color of the small blind/big blind buttons?
 * Appears to be different if defeated vs skipped. Also might matter for boss as well?
 *
 * TODO: Boss blind color depends on the boss. Meaning stageselect would need access to
 * to this data (eg run seed) along with data for how the run has progressed
 */

function StageSelect(){
  const blindsCompleted = 0;
  const blindCompletions = ['Defeated', 'Select', 'Upcoming']

  return (
    <section className="stageselect">
      <div id="smallblind-column" className="stage-column">
        <div className="blind-infobox">
          <div className="status-button defeated-button">
            Defeated {/*select-button, upcoming-button, skipped-button can replace defeated-button*/}
          </div>
          <div className="blind-label smallblind-label">
            Small Blind {/*smallblind-label, bigblind-label, or boss-label can replace defeated-label*/}
          </div>
          <div className="blind-circle">
            <img src="/stage/small-blind.png" />
          </div>
          <div className="blind-scorebox">
            <div>Score at least</div>
            <div>
              <img src="/chips/white-chip.png" />
              <span>2800</span>
            </div>
            <div>Reward: <span style={{color: "yellow"}}>$$$+</span></div>
          </div>
        </div>

        <div>or</div>

        <div className="blind-skipbox">
          <img src="/tags/double-money-tag.png" />
          <div className="skip-button">Skip Blind</div>
        </div>
      </div>

      <div id="bigblind-column" className="stage-column">

      </div>
      <div id="bossblind-column" className="stage-column">

      </div>
    </section>
  )
}

export default StageSelect;