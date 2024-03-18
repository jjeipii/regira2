import React from 'react';
import {useDraggable} from '@dnd-kit/core';

 function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: props.id,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;


  return (
    <div ref={setNodeRef} key={props.issueId} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  )

  
}

export default Draggable;
