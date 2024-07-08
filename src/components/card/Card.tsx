import "./Card.css";
import {useState} from 'react';
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { Card as CardType } from "../../types/misc-types";
import { getRankStr } from "../../types/misc-functions";


type CardComponent = {id: number} & CardType

function Card({id, rank, suit, type, enhanced, special, seal}: CardComponent){
  const {attributes, listeners, setNodeRef,
    transform, transition} = useSortable({id});

  const [selected, setSelected] = useState(false);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const imgSrc = `/cards/${getRankStr(rank)}-${suit}.png`;
  function handleClick(){
    console.log('clicked card');
    setSelected(prev => !prev);
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