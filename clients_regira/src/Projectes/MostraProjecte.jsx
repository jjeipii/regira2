import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DndContext } from '@dnd-kit/core';

import Droppable from '../DragsAndDrops/Droppable';
import Draggable from '../DragsAndDrops/Draggable';
import EstadosIssues from "../DragsAndDrops/EstadosIssues";

const API_URL = 'http://localhost:3000/api';

const colors = ['bg-red-200', 'bg-yellow-200', 'bg-blue-200', 'bg-purple-200', 'bg-green-200', 'bg-neutral-200'];

export default () => {
    const { idProj } = useParams();
    const [projecte, setProjecte] = useState({});
    const [estados, setEstados] = useState([]);
    const [issues, setIssues] = useState({});
    const [error, setError] = useState(false);
    const [draggs, setDraggs] = useState([]);
    const [parent, setParent] = useState([]);

    const [nEstados, setNEstados] = useState({})
    const [neutral, setNeutral] = useState({})


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
                    data.map(estado => nEstados[estado] = {})
                    setNEstados(nEstados);
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
                    const cpDraggs = [];
                    data.forEach((issue, key) => {
                        cpIssuesValors.push(issue.estado_issue);
                        cpDraggs.push(<Draggable id={issue.estado_issue} key={issue.id} issueId={issue.id} children={issue.nom_issue}></Draggable>);
                    });
                    setParent(cpIssuesValors);
                    setDraggs(cpDraggs);
                    setIssues(data);
                }
            });


    }, []);

    useEffect(() => {

        if (issues && nEstados && Array.isArray(issues)) {

            let newCpNEstados = { ...nEstados }
            issues.map((issue) => {
                const estado = issue.estado_issue
                const id = issue.id
                const obj = { [estado]: { ...(newCpNEstados[estado] || {}), [id]: issue } }
                newCpNEstados = { ...newCpNEstados, ...obj }
            })
            setNEstados(newCpNEstados)
            setNeutral(newCpNEstados)
            
        } else {
            <h1 className='text-red-500'>Cargant...</h1>;
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
        nEstados((taskList) => {
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

    if (error) {
        return <h1 className='text-red-500'>{error}</h1>;
    }

    const allStatesEmpty = Object.values(nEstados).every(state => Object.keys(state).length === 0);


    if (parent.length < 1 || !nEstados || allStatesEmpty) {
        return <h1 className='text-red-500'>Cargant...</h1>;
    }

    if (!nEstados) {
        return <h1 className='text-red-500'>Cargant...</h1>;
    }

    

    return (

        <>
        {console.log(nEstados)}
            <div className="flex justify-between pb-6">
                <h1 className="text-2xl font-medium">{projecte.nom_projecte}</h1>
                <div className="">
                    <Link to={`/projecte/${idProj}/newIssue`}><button className="border rounded-md bg-neutral-600 text-zinc-100 hover:shadow-sm hover:bg-neutral-500 p-2 text-sm duration-300" type="submit">New Issue</button></Link>
                </div>
            </div>
            <div className='flex overflow-x-auto h-[500px] overflow-y-hidden space-x-8 w-full'>
                <DndContext onDragEnd={handleDragEnd}>
                    {estados.map((estado, estadoKey) => (
                        <Droppable key={estado} id={estado} className={`${colors[estadoKey]} w-[400px] h-full text-center flex-shrink-0 rounded-md border-2`}>
                            <p className="text-xl font-medium py-6 uppercase">{estado}</p>
                            <div>
                                {draggs.map((drag, key) => { if (drag.props.id === estado) return draggs[key] })}
                            </div>
                        </Droppable>
                    ))}
                </DndContext>
            </div>
            <DndContext onDragEnd={dragEndHandler} onDragOver={dragOverHandler}>
                <main >
                    <h1>Multi Sortable List</h1>
                    <section>
                    {estados.map((key) => {
                        if (neutral[key][1]['estado_issue'] == key){
                        console.log(neutral[key][1]['id'])
                    }else {
                        console.log(key)
                    }
                    })}
                    </section>
                </main>
            </DndContext>
        </>
    );


    function handleDragEnd(event) {
        const { active, over } = event;
        const dragText = event.activatorEvent.srcElement.innerHTML;
        const dragIndex = draggs.findIndex(drag => drag.props.children === dragText);
        console.log(dragText)

        // Obtenemos el ID único del elemento arrastrado
        const draggedItemId = active.id;

        // Si no hay un droppable sobre el que se soltó el elemento, salimos de la función
        if (!over) return;

        // Obtenemos el ID del droppable sobre el que se soltó el elemento
        const droppableId = over.id;

        // Actualizamos el estado solo si el elemento se soltó en un droppable diferente
        if (draggedItemId && droppableId !== draggedItemId) {
            // Actualizamos el estado del elemento arrastrado
            const updatedDraggs = draggs.map(drag => {
                // Si el ID del elemento arrastrado coincide con el ID del droppable, lo actualizamos
                if (drag.props.id === draggedItemId) {
                    return React.cloneElement(drag, { id: droppableId });
                }
                return drag;
            });

            // Actualizamos el estado con los elementos arrastrables actualizados
            setDraggs(updatedDraggs);

            // También puedes actualizar otros estados relacionados según sea necesario
        }

        // const { over } = event;
        // const dragText = event.activatorEvent.srcElement.innerHTML;

        // // Encuentra el elemento arrastrable correspondiente por su texto
        // const dragRef = draggs.find(drag => drag.props.children === dragText);


        // // Si no se encuentra el elemento arrastrable, salimos de la función
        // if (!dragRef) return;
        // const dragIndex = draggs.findIndex(drag => drag.props.children === dragText);

        // // Actualiza el elemento arrastrable con el nuevo id
        // const updatedDragRef = React.cloneElement(dragRef, { id : over ? over.id : parent[dragIndex] });

        // // Crea una nueva matriz con el elemento arrastrable actualizado
        // const updatedDraggs = [...draggs];
        // updatedDraggs[dragIndex] = updatedDragRef;

        // // Actualiza el estado con la nueva matriz de elementos arrastrables
        // setDraggs(updatedDraggs);

        // // Actualiza el estado parent si es necesario
        // const updatedParent = [...parent];
        // updatedParent[dragRef.props.issueId -1] = over ? over.id : parent[dragIndex];
        // setParent(updatedParent);

        // console.log(updatedDraggs)
        // console.log(updatedParent)

        //setParent(over === null ? parent : over.id);
    }
};
