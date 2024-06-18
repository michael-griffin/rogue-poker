import {useState} from 'react'
import {DndContext, closestCorners} from '@dnd-kit/core';
import {arrayMove} from '@dnd-kit/sortable';
import Row from './Row';

type Card = {
  rank: number,
  suit: 'clubs' | 'diamonds' | 'hearts' | 'spades' //string,
  type: 'ace' | 'face' | 'number' | 'stone'
  enhanced: string | null,
  special: string | null,
  seal: string | null
}

function DnDmain(){
  const defaultCards = [
    {id: 1, rank: 2, suit: 'clubs'},
    {id: 2, rank: 3, suit: 'clubs'},
    {id: 3, rank: 4, suit: 'clubs'},
    {id: 4, rank: 5, suit: 'clubs'},
    {id: 5, rank: 6, suit: 'clubs'},
  ];


  const [cards, setCards] = useState(defaultCards);

  function getCardPos(id){
    return cards.findIndex(card => card.id === id);
  }
  function handleOnDragEnd(event){
    //active is currently dragged, over is the element it's hovering over
    const {active, over} = event;
    if (active.id === over.id) return;


    setCards(prevCards => {
      const originalPos = getCardPos(active.id);
      const newPos = getCardPos(over.id);
      return arrayMove(prevCards, originalPos, newPos);
    })

  }

  return (
    <>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleOnDragEnd}>
        <Row cards={cards} />
      </DndContext>
    </>
  )
}

export default DnDmain;