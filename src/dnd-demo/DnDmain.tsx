import {useState} from 'react';
import {DndContext,
  DragEndEvent,
  closestCorners,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {arrayMove} from '@dnd-kit/sortable';
import {Card as CardType} from '../types/misc-types';
import CardList from '../components/card-list/CardList';

function DnDmain(){
  type CardComponent = CardType & {id: number};
  const defaultCards: CardComponent[] = [
    {id: 1, rank: 2, suit: 'clubs', type: 'number', enhanced: null, special: null, seal: null},
    {id: 2, rank: 3, suit: 'clubs', type: 'number', enhanced: null, special: null, seal: null},
    {id: 3, rank: 4, suit: 'clubs', type: 'number', enhanced: null, special: null, seal: null},
    {id: 4, rank: 5, suit: 'clubs', type: 'number', enhanced: null, special: null, seal: null},
    {id: 5, rank: 6, suit: 'clubs', type: 'number', enhanced: null, special: null, seal: null},
  ];

  const [cards, setCards] = useState(defaultCards);


  function getCardPos(id: number){
    return cards.findIndex(card => card.id === id);
  }
  function handleOnDragEnd(event: DragEndEvent){
    //active is currently dragged, over is the element it's hovering over
    const {active, over} = event;
    if (active.id === over.id) return;


    setCards(prevCards => {
      const originalPos = getCardPos(+active.id);
      const newPos = getCardPos(+over.id);
      return arrayMove(prevCards, originalPos, newPos);
    })

  }

  const mouseSensor = useSensor(MouseSensor, {
    onActivation: (event) => console.log("onActivation", event), // Here!
    activationConstraint: { distance: 15 }
  });
  const sensors = useSensors(
    mouseSensor
  );

  return (
    <>
      <DndContext sensors={sensors}
      collisionDetection={closestCorners} onDragEnd={handleOnDragEnd}>
        <CardList cards={cards} />
      </DndContext>
    </>
    //<Row cards={cards} />
  )
}

export default DnDmain;