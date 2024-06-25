import {Joker as JokerType} from "../../types/misc-types"

function Joker({name, special, negative, price, sellValue}: JokerType){

  const imgName = `../../assets/jokers/${name}.png`;
  return (
    <div className="Joker">
      <img src={imgName} />
    </div>
  )
}

export default Joker;