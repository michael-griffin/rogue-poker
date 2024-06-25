import Joker from "../joker/Joker";
import {Joker as JokerType} from "../../types/misc-types"

type JokerListProps = {
  jokers: JokerType[]
}
function JokerList({jokers}: JokerListProps){ //

  return jokers.map(joker => {
    const {name, special, negative, price, sellValue} = joker;
    return <Joker
      name={name}
      special={special}
      negative={negative}
      price={price}
      sellValue={sellValue}
    />
  })
}

export default JokerList;