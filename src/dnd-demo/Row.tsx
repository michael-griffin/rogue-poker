
import {SortableContext, horizontalListSortingStrategy} from "@dnd-kit/sortable"
import Card from "../components/card/Card"

function Row({cards}){

  return (
    <>
      <div>This is a row</div>
      <SortableContext items={cards} strategy={horizontalListSortingStrategy}>
        {cards.map(card => (
          <Card key={card.id} id={card.id} rank={card.rank} suit={card.suit} />
        ))}
      </SortableContext>

    </>
  )
}
export default Row;