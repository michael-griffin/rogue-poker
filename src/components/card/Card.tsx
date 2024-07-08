import "./Card.css";
import {useState} from 'react';
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { CardComponent } from "../../types/misc-types";
import { getRankStr } from "../../types/misc-functions";


type ToggleSelectedFn = (id: number) => void;
type CardComponentProps = {
  card: CardComponent,
  toggleSelected: ToggleSelectedFn
}

function Card({card, toggleSelected}: CardComponentProps){
  const {id, selected, rank, suit, type, enhanced, special, seal} = card;
  const {attributes, listeners, setNodeRef,
    transform, transition} = useSortable({id});

  //const [selected, setSelected] = useState(false);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const imgSrc = `/cards/${getRankStr(rank)}-${suit}.png`;
  function handleClick(){
    toggleSelected(id);
    console.log('clicked card');
    // setSelected(prev => !prev);
  }
  const selectedClass = selected ? 'selected' : '';

  return (
    <div
      style= {style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <img className={`card ${selectedClass}`} src={imgSrc} onClick={handleClick}/>
    </div>
  )
}

export default Card;