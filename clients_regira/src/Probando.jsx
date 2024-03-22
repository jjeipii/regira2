import React, { useEffect,  useState} from 'react';
import { DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import styles from "./App.module.css";
import TaskList from "./components2/task-list/TaskList.jsx";
import { useParams } from 'react-router-dom';


const API_URL = 'http://localhost:3000/api';


const Probando = () => {
  const [taskList, setTaskList] = useState({
    Planned: ["Learn React", "Learn dnd-kit", "Learn Typescript"],
    Processed: ["Learn CSS"],
    Done: []
  });

  const { idProj } = useParams();
  const [projecte, setProjecte] = useState({});
  const [estados, setEstados] = useState([]);
  const [issues, setIssues] = useState({});
  const [error, setError] = useState(false);
  const [parent, setParent] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nEstados, setNEstados] = useState({})
  const [neutral, setNeutral] = useState([])


  useEffect(() => {
      const opcions = {
          credentials: 'include',
      };
      fetch(API_URL + '/projectes/estados', opcions)
          .then(resp => resp.json())
          .then(data => {
              if (data.error) {
                  setError(data.error);
              } else {
                  setEstados(data);
                  const nEstados = {}
                  const cpNeutral = []
                  data.map(estado => {
                    nEstados[estado] = {}
                    cpNeutral[estado]=[]})

                  setNEstados(nEstados)
                  setNeutral(cpNeutral)

              }
          });
  }, []);

  useEffect(() => {
      const opcions = {
          credentials: 'include',
      };
      fetch(API_URL + `/projectes/${idProj}`, opcions)
          .then(resp => resp.json())
          .then(data => {
              if (data.error) {
                  setError(data.error);
              } else {
                  setProjecte(data);
              }
          });
  }, []);

  useEffect(() => {
      const opcions = {
          credentials: 'include',
      };
      fetch(API_URL + `/projecte/${idProj}/issues`, opcions)
          .then(resp => resp.json())
          .then(data => {
              if (data.error) {
                  setError(data.error);
              } else {
                  const cpIssuesValors = [];
                  data.forEach((issue, key) => {
                      cpIssuesValors.push([issue.estado_issue,issue.id,issue.nom_issue]);
                  });
                  setParent(cpIssuesValors);
                  setIssues(data);
                 
              }
          });


  }, []);

    useEffect(() => {

      if (nEstados && issues &&  Array.isArray(issues) &&  Array.isArray(neutral)) {

          let newCpNEstados = { ...nEstados }
          let newArrNEstados = [ ...neutral ] 

          Object.keys( { ...nEstados }).map((key) => {
            newArrNEstados[key] = []
          })

          issues.map((issue) => {
              const estado = issue.estado_issue
              const id = Object.keys(newCpNEstados[estado]).length === 0 ? 0 : Object.keys(newCpNEstados[estado]).length
              const obj = { [estado]: { ...(newCpNEstados[estado] || {}), [id]: issue } }
              newCpNEstados = { ...newCpNEstados, ...obj }

              let keysId = newArrNEstados[estado].length
              let issueKeys = Object.keys(issue)
              issueKeys.map((key) => {
                let keyVar = key.toString()
                if (!newArrNEstados[estado][keysId]) {
                  newArrNEstados[estado][keysId] = []; // Initialize if not defined
                }
                newArrNEstados[estado][keysId][keyVar] = issue[keyVar]; // Add value to the array
            })})
              
          setNEstados(newCpNEstados)
          setNeutral(newArrNEstados)

          setLoading(false)
      
          }
  }, [issues]);
 


  const dragEndHandler = (e) => {
    // Check if item is drag into unknown area
    if (!e.over || !e.active.data.current || !e.over.data.current) return;

    // Check if item position is the same
    if (e.active.id === e.over.id) return;

    // Check if item is moved outside of the column
    if (
      e.active.data.current.sortable.containerId !==
      e.over.data.current.sortable.containerId
    )
      return;

    // Sort the items list order based on item target position
    const containerName = e.active.data.current.sortable.containerId;
    setTaskList((taskList) => {
      const temp = { ...taskList };
      if (!e.over) return temp;
      const oldIdx = temp[containerName].indexOf(e.active.id.toString());
      const newIdx = temp[containerName].indexOf(e.over.id.toString());
      temp[containerName] = arrayMove(temp[containerName], oldIdx, newIdx);
      return temp;
    });
  };

  const dragOverHandler = (e) => {
    // Check if item is drag into unknown area
    if (!e.over) return;

    // Get the initial and target sortable list name
    const initialContainer = e.active.data.current?.sortable?.containerId;
    const targetContainer = e.over.data.current?.sortable?.containerId;
    console.log(initialContainer, targetContainer);
    // if there are none initial sortable list name, then item is not sortable item
    if (!initialContainer) return;

    // Order the item list based on target item position
    setTaskList((taskList) => {
      const temp = { ...taskList };
      
      // If there are no target container then item is moved into a droppable zone
      // droppable = whole area of the sortable list (works when the sortable list is empty)
      if (!targetContainer) {
        // If item is already there then don't re-added it
        if (taskList[e.over.id].includes(e.active.id.toString())) return temp;
        

        // Remove item from it's initial container
        temp[initialContainer] = temp[initialContainer].filter(
          (task) => task !== e.active.id.toString()
        );

        // Add item to it's target container which the droppable zone belongs to
        temp[e.over.id].push(e.active.id.toString());

        return temp;
      }

      // If the item is drag around in the same container then just reorder the list
      if (initialContainer === targetContainer) {
        console.log(initialContainer, targetContainer);
        console.log( e.active, e.over );
        const oldIdx = temp[initialContainer].indexOf(e.active.id.toString());
        const newIdx = temp[initialContainer].indexOf(e.over.id.toString());
       
        temp[initialContainer] = arrayMove(
          temp[initialContainer],
          oldIdx,
          newIdx
        );
      } else {
        // If the item is drag into another different container

        // Remove item from it's initial container
        temp[initialContainer] = temp[initialContainer].filter(
          (task) => task !== e.active.id.toString()
        );

        // Add item to it's target container
        const newIdx = temp[targetContainer].indexOf(e.over.id.toString());
        temp[targetContainer].splice(newIdx, 0, e.active.id.toString());
      }

      return temp;
    });
  };

  const dragOverHandler2 = (e) => {
    // Check if item is drag into unknown area
    if (!e.over) return;

    // Get the initial and target sortable list name
    const initialContainer = e.active.data.current?.sortable?.containerId;
    const targetContainer = e.over.data.current?.sortable?.containerId;
    console.log(initialContainer, targetContainer);
    // if there are none initial sortable list name, then item is not sortable item
    if (!initialContainer) return;
    
    // Order the item list based on target item position
    setNeutral((neutral) => {
      const temp = [ ...neutral]
        console.log(neutral.length == 0)
      // If there are no target container then item is moved into a droppable zone
      // droppable = whole area of the sortable list (works when the sortable list is empty)
      if (!targetContainer) {
        // If item is already there then don't re-added it
        if (neutral[e.over.id].includes(e.active.id.toString())) {
          return temp
        };
        
        // Remove item from it's initial container
        temp[initialContainer] = temp[initialContainer].filter(
          (task) => task !== e.active.id.toString()
        );
        console.log(temp)
        // Add item to it's target container which the droppable zone belongs to
        temp[e.over.id].push(e.active.id.toString());

        return temp;
      }
      
      // If the item is drag around in the same container then just reorder the list
      if (initialContainer === targetContainer) {
        console.log( initialContainer, temp, e.active.id.toString() );
        const oldIdx = temp[initialContainer].indexOf(e.active.id.toString());
        const newIdx = temp[initialContainer].indexOf(e.over.id.toString());
        console.log(oldIdx, newIdx)
        temp[initialContainer] = arrayMove(
          temp[initialContainer],
          oldIdx,
          newIdx
        );
      } else {
        // If the item is drag into another different container

        // Remove item from it's initial container
        temp[initialContainer] = temp[initialContainer].filter(
          (task) => task !== e.active.id.toString()
        );

        // Add item to it's target container
        const newIdx = temp[targetContainer].indexOf(e.over.id.toString());
        temp[targetContainer].splice(newIdx, 0, e.active.id.toString());
      }
      console.log(temp);
      return temp;
    });
  };

  if(loading){
    return <h1 className='text-red-500'>Cargant...</h1>
  }

  return (
  <>
    <DndContext onDragEnd={dragEndHandler} onDragOver={dragOverHandler}>
      <main className={styles.main}>
        <h1>Multi Sortable List</h1>
        <section className={styles.container}>
          {Object.keys(taskList).map((key) => { return <TaskList key={key} title={key} tasks={taskList[key]} /> })}
        </section>
      </main>
    </DndContext>
    {console.log(neutral.length === 0)}
    <DndContext  onDragOver={dragOverHandler2}>
    <main className={styles.main}>
      <h1>Multi Sortable List</h1>
      <section className={styles.container}>
        {estados.map((estado,key) => { 
          
          return <TaskList key={estado} keyEstado={key} title={estado} tasks={neutral[estado]}/>})
        }
      </section>
    </main>
  </DndContext>
  

  </>
  );
  
}

export default Probando;
 