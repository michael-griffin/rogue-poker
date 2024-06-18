import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

function Card({id, rank, suit}){
  const {attributes, listeners, setNodeRef,
    transform, transition} = useSortable({id});


  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div className="card"
      style= {style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {rank} of {suit}
    </div>
  )
}

export default Card;