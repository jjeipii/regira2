import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import React, { FC } from "react";
import TaskItem from "../task-item/TaskItem";
import styles from "./TaskList.module.css";

const TaskList = (props) => {
  const { setNodeRef } = useDroppable({ id: props.title });
  /* {keysTasks.map(key => {
            if(tasks[1][key] != null){
              return <TaskItem key={tasks[1][key].id} id={key} title={tasks[1][key].nom_issue} />
            }})}*/
  return (  
    <article className={styles.column}>
      <h1>{props.title}</h1>
      <div className={styles.divider} />
      <SortableContext id={props.title} items={props.tasks}>
        <ul ref={setNodeRef} className={styles.list}>
        {props.tasks.map((task) => {
          if (!Array.isArray(task)){
            return <TaskItem key={task} title={task} />
          } else {
            return <TaskItem key={task['id']} title={task['nom_issue']} />
          }})}
        </ul>
      </SortableContext>
    </article>
  );
};  

export default TaskList;
