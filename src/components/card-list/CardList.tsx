import "./CardList.css";
import {SortableContext, horizontalListSortingStrategy} from "@dnd-kit/sortable"
import Card from "../card/Card";
import {Card as CardType} from "../../types/misc-types"


type CardComponent = {id: number} & CardType
type CardListProps = {
  cards: CardComponent[]
}

function CardList({cards}: CardListProps){ //

  const cardsJSX = cards.map(card => {
    const {id, rank, suit, type, enhanced, special, seal} = card;
    return <Card
      id={id} //note that CardList expects these to start at 1, not 0.
      rank={rank}
      suit={suit}
      type={type}
      enhanced={enhanced}
      special={special}
      seal={seal}
    />
  })

  return (
    <>
      <div>Start of CardList</div>
      <div className="cardlist">
      <SortableContext items={cards} strategy={horizontalListSortingStrategy}>
          {cardsJSX}
      </SortableContext>
      </div>
    </>
  )
}
/**
 *       <SortableContext items={cards} strategy={horizontalListSortingStrategy}>
        {cardsJSX}
      </SortableContext>
 */
export default CardList;