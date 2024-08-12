import './Shop.css'

function Shop(){

  function calcReroll(){
    /** Reroll joker sets first reroll to 0, reroll voucher reduces
     * base cost of reroll by 2.
     */
    return 5;
  }

  return (
    <div className='shop-area'>
      <div className="shop-menu-outer">
        <div className="shop-menu">
          <div className="menu-top">
           <div className="top-buttons">
              <div className="next-button">
                <div>Next</div>
                <div>Round</div>
              </div>
              <div className="reroll-button">
                <div>Reroll</div>
                <div className="reroll-cost">{`$${calcReroll()}`}</div>
              </div>
            </div>
            <div className="top-sales">
              <div className="item1 sales-item">
                <div className="price-box"><div className="price-text">$2</div></div>
                <img className="item-img" src="/tarots/tarot-chariot.png" />
              </div>
              <div className="item2 sales-item">
              <div className="price-box"><div className="price-text">$2</div></div>
                <img src="/tarots/tarot-chariot.png" />
              </div>
            </div>
          </div>

          <div className="menu-bottom">
            <div className="bottom-vouchers">
              <div className="voucher1 sales-item">
                <div className="price-box"><div className="price-text">$2</div></div>
                <img src="/vouchers/voucher-discard.png" />
              </div>
            </div>

            <div className="bottom-sales">
              <div className="pack1 sales-item">
              <div className="price-box"><div className="price-text">$2</div></div>
                <img src="/boosters/tarot-pack-normal-v1.png" />
              </div>
              <div className="pack2 sales-item">
              <div className="price-box"><div className="price-text">$2</div></div>
                <img src="/boosters/tarot-pack-normal-v2.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


{/* <div className="voucher-label">ANTE 1 VOUCHER</div> */}
export default Shop;