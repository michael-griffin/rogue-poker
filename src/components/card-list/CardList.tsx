import Card from "../card/Card";
import {Card as CardType} from "../../types/misc-types"

type CardListProps = {
  jokers: CardType[]
}
function CardList({cards}: CardListProps){ //

  return cards.map(card => {
    const {...} = card;
    return <Card
      name={name}
    />
  })
}

export default CardList;