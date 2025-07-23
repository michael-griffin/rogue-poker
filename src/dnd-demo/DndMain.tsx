//import { useState } from 'react'
import { type DragEndEvent } from '@dnd-kit/core'
import Card from './Card'
import DndList from './DndList';
import {
  useSimpleCardStore,
  useCardActions,
  useDealtCards,
  useCardOrder,
} from "./cardStore"



function DndMain() {
  const cardStore = useSimpleCardStore();
  const dealtCards = useDealtCards();
  const cardOrder = useCardOrder();

  //console.log('card store: ', cards);
  // console.log('dealtCards: ', dealtCards);
  console.log('card order: ', cardOrder);

  const { swapOrder } = useCardActions();

  function swapOnClick(){
    swapOrder(0, 2);
    console.log('swapping card order');
    console.log('new cards: ', cardStore);
  }

  function handleDragEnd(event:DragEndEvent){ //event: DragEndEvent
    //active is currently dragged, over is the element it's hovering over
    const {active, over} = event;
    // console.log('active: ', active);
    // console.log('over: ', over);
    const oldInd = cardOrder.indexOf(active.id); //(active.id as number);
    const newInd = cardOrder.indexOf(over.id);  //(over?.id as number);
    swapOrder(oldInd, newInd);
  }


  function getCardsJSX(){
    return cardOrder.map(ind => {
      let card = dealtCards[ind];
      return <Card id={ind} canSelect={true} card={card} />
    })
  }
  const cardsJSX = getCardsJSX();

  return (
    <>
      <h1>DnD Test - Card dragging</h1>
      <button onClick={swapOnClick}>Swap Order</button>
      <DndList order={cardOrder} children={cardsJSX} handleDragEnd={handleDragEnd} />
    </>
  )
}


export default DndMain;
