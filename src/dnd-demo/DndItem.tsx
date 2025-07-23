import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

import { type ReactElement } from 'react';

type DndItemProps = {
  id: number,
  child: ReactElement,
}

function DndItem(props:DndItemProps) {
  const {id, child} = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {child}
    </div>
  );
}

export default DndItem;