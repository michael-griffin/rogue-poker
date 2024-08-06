import Joker from "../joker/Joker";
import {Joker as JokerType} from "../../types/misc-types"

type JokerListProps = {
  jokers: JokerType[]
}
function JokerSection({jokers}: JokerListProps){ //

  const jokerListJSX = jokers.map(joker => {
    const {name, special, negative, price, sellValue} = joker;
    return <Joker
      name={name}
      special={special}
      negative={negative}
      price={price}
      sellValue={sellValue}
    />
  });

  return (
    <section className="joker-section">
      {jokerListJSX}
    </section>
  )
}

export default JokerSection;