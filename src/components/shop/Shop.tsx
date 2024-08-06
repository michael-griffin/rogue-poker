

function Shop(){

  function calcReroll(){
    /** Reroll joker sets first reroll to 0, reroll voucher reduces
     * base cost of reroll by 2.
     */
    return 5;
  }

  return (
    <div className="shop-full">
      <div className="shop-top">
        <div className="shop-buttons">
          <div className="next-button">Next Round</div>
          <div className="reroll-button">
            <div>Reroll</div>
            <div className="reroll-cost">{`$${calcReroll()}`}</div>
          </div>
        </div>
        <div className="shop-top-items">
          <div className="item1">
            <div className="item-price">$2</div>
          </div>
          <div className="item2">
            <div className="item-price">$2</div>
          </div>
        </div>

        <div className="shop-bottom">
          <div className="shop-vouchers">
            {/* <div className="voucher-label">ANTE 1 VOUCHER</div> */}
            <div className="voucher1 voucher">
              <div className="voucher-price">$7</div>
              <img src="/vouchers/voucher-discard.png" />
            </div>
          </div>
          <div className="shop-packs">
            <div className="pack1 pack">
              <div className="pack-price">$3</div>
              <img src="/tarots/tarot-chariot.png" />
            </div>
            <div className="pack2 pack">
              <div className="pack-price">$4</div>
              <img src="/tarots/tarot-death.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default Shop;