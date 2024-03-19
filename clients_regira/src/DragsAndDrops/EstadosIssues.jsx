import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import IssueDrag from "./IssueDrag";


const EstadosIssues = (props) => {
  const { setNodeRef } = useDroppable({ id: props.title });
  return (
    <article>
      <h1>{props.title}</h1>
      <div />
      <SortableContext id={props.title} items={props.tasks}>
        <ul ref={setNodeRef} >
          {props.tasks.map((task) => (
            <IssueDrag key={task} title={task} />
          ))}
        </ul>
      </SortableContext>
    </article>
  );
};

export default EstadosIssues;