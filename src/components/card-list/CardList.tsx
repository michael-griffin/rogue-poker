import "./CardList.css";
import {SortableContext, horizontalListSortingStrategy} from "@dnd-kit/sortable"
import Card from "../card/Card";
import {CardComponent} from "../../types/misc-types"


//type CardComponent = {id: number} & CardType
type ToggleSelectedFn = (id: number) => void;
type CardListProps = {
  cards: CardComponent[],
  toggleSelected: ToggleSelectedFn
}

function CardList({cards, toggleSelected}: CardListProps){ //

  const cardsJSX = cards.map(card => {
    return <Card card={card} toggleSelected={toggleSelected} />
    // const {id, selected, rank, suit, type, enhanced, special, seal} = card;
    // return <Card
    //   id={id} //note that CardList expects these to start at 1, not 0.
    //   selected={selected}
    //   rank={rank}
    //   suit={suit}
    //   type={type}
    //   enhanced={enhanced}
    //   special={special}
    //   seal={seal}
    //   toggleSelected={toggleSelected}
    // />
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