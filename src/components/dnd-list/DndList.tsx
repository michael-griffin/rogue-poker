/** Idea, trying to separate DnD syntax from components. Ideally
 * want a list and/or a drag item.
 *
 * DragList will handle
 * DnD context
 * Sortable context
 *
 */
import "./DragList.css";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  //arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  //verticalListSortingStrategy,
  horizontalListSortingStrategy,
  //useSortable,
} from '@dnd-kit/sortable';

import DndItem from "../dnd-item/DndItem";
import { type DragEndEvent } from '@dnd-kit/core';
import { type ReactElement } from 'react';



type DragListProps = {
  order: number[], //order of list items, modified as we drag + drop
  handleDragEnd: (event: DragEndEvent) => void,
  children: ReactElement[], //array of children to be rendered
}

function DndList(props:DragListProps){
  const {order, children, handleDragEnd} = props;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  function getListJSX(){
    return order.map((orderVal, ind) => {
      let child = children[ind];
      return <DndItem key={orderVal} id={orderVal} child={child} />
    })
  }
  const listJSX = getListJSX();

  return (
    <>
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={order}
        strategy={horizontalListSortingStrategy}
      >
        <div className="dnd-list">
          {listJSX}
        </div>
      </SortableContext>
    </DndContext>
    </>
  )
}


export default DndList;


// function handleDragEnd(event){ //event: DragEndEvent
//   //active is currently dragged, over is the element it's hovering over
//   const {active, over} = event;

//   setItems(prev => {
//     const oldInd = prev.indexOf(active.id);
//     const newInd = prev.indexOf(over.id);
//     let result = arrayMove(prev, oldInd, newInd);
//     console.log(result);
//     return result;
//   })
// }