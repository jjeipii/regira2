import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


const IssueDrag = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.title
    });
  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition
      }}
      className="cursor-grab hover:cursor-grabbing"
    >
      {props.title}
    </li>
  );
};

export default IssueDrag;