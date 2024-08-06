
import './StageSelect.css';


/**
 * TODO: Boss blind color depends on the boss. Meaning stageselect would need access to
 * to this data (eg run seed) along with data for how the run has progressed
 */

function StageSelect(){
  const blindsCompleted = 0;
  const blindCompletions = ['Defeated', 'Selected', 'Upcoming']; //'Skipped', 'Selected', 'Upcoming', 'Defeated'

  return (
    <section className="stageselect">
      {/* columns are either small/big/boss (or those + selected), and can have additional
      modifier of defeated-column/upcoming-column */}
      <div className="smallblind-column stage-column defeated-column">
        <div className="blind-infobox">
          <div className="status-button defeated-button">
            Defeated {/*select-button, upcoming-button, skipped-button can replace defeated-button*/}
          </div>
          <div className="blind-label smallblind-label defeated-label">
            Small Blind {/*smallblind-label, bigblind-label, or boss-label, with optional defeated-label*/}
          </div>
          <div className="blind-circle">
            <img src="/stage/small-blind.png" />
          </div>
          <div className="blind-scorebox">
            <div className="score-text-top">Score at least</div>
            <div className="score-middle">
              <img src="/chips/white-chip.png" />
              <span className="score-text-middle">28,000</span>
            </div>
            <div className="score-text-bottom">
              Reward: <span className="score-text-money">$$$+</span>
            </div>
          </div>
        </div>

        <div className="blind-or">or</div>

        <div className="blind-skipbox">
          <img src="/tags/double-money-tag.png" />
          <div className="skip-button">Skip Blind</div>
        </div>
      </div>

      <div className="bigblind-select-column stage-column">
        <div className="blind-infobox">
          <div className="status-button select-button">
            Select
          </div>
          <div className="blind-label bigblind-label">
            Big Blind
          </div>
          <div className="blind-circle">
            <img src="/stage/big-blind.png" />
          </div>
          <div className="blind-scorebox">
            <div className="score-text-top">Score at least</div>
            <div className="score-middle">
              <img src="/chips/white-chip.png" />
              <span className="score-text-middle">35,000</span>
            </div>
            <div className="score-text-bottom">
              Reward: <span className="score-text-money">$$$$+</span>
            </div>
          </div>
        </div>

        <div className="blind-or">or</div>

        <div className="blind-skipbox">
          <img src="/tags/double-money-tag.png" />
          <div className="skip-button">Skip Blind</div>
        </div>
      </div>

      <div className="bossblind-column stage-column upcoming-column">
        <div className="blind-infobox">
          <div className="status-button upcoming-button">
            Upcoming
          </div>
          <div className="blind-label bossblind-label">
            The Wheel
          </div>
          <div className="blind-iconbox">
            <div className="blind-circle">
              <img src="/stage/big-blind.png" />
            </div>
            <div className="boss-message">
              1 in 7 cards get drawn face down
            </div>
          </div>
          <div className="blind-scorebox">
            <div className="score-text-top">Score at least</div>
            <div className="score-middle">
              <img src="/chips/white-chip.png" />
              <span className="score-text-middle">40,000</span>
            </div>
            <div className="score-text-bottom">
              Reward: <span className="score-text-money">$$$$$+</span>
            </div>
          </div>
        </div>
        <div className="blind-nextstage">
            <div className="nextstage-header">Up the Ante</div>
            <div className="nextstage-text">Raise all Blinds</div>
            <div className="nextstage-text">Refresh Blinds</div>
        </div>
      </div>
    </section>
  )
}

export default StageSelect;