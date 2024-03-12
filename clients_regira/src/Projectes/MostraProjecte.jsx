import { React, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {DndContext} from '@dnd-kit/core';

import Droppable from '../DragsAndDrops/Droppable';
import Draggable from '../DragsAndDrops/Draggable';


const API_URL = 'http://localhost:3000/api';

export default () => {

    const {idProj} = useParams()
    const [bolet, setBolet] = useState({})
    const [error, setError] = useState(false)
    const [estados, setEstados] = useState([])

    const colors = ['bg-red-200','bg-yellow-200','bg-blue-200','bg-purple-200','bg-green-200','bg-neutral-200']

    const [parent, setParent] = useState(null);
    const draggableMarkup = (
      <Draggable id="draggable">Drag me</Draggable>
    );

    const opcions = {
        credentials: 'include',
    }

    useEffect(() => {
        fetch(API_URL + `/projectes/${idProj}`, opcions)
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    setError(data.error)
                } else {
                    console.log(data)
                    setBolet(data);
                }
            })

    }, [])

    useEffect(() => {
        fetch(API_URL + '/projectes/estados', opcions)
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    setError(true)
                } else {
                    setEstados(data);
                    setParent(data[0])
                }
            })
    }, [])


    if (error) {
        return <h1 className='text-red-500'>{error}</h1>
        
    }

    return (
        <>
            <div className="flex justify-between pb-6">
                <h1 className="text-2xl font-medium">{bolet.nom_projecte}</h1> 
                <div className="">
                <Link to={`/projecte/${idProj}/newIssue`}><button className="border rounded-md bg-neutral-600 text-zinc-100 hover:shadow-sm hover:bg-neutral-500 p-2 text-sm duration-300" type="submit">New Issue</button></Link>
                </div>
            </div>
            <div className='flex overflow-x-auto h-[500px] overflow-y-hidden space-x-8 w-full'>
            <DndContext onDragEnd={handleDragEnd} >
                {parent === null ? draggableMarkup : null}
                
                    {estados.map((id,key) => (
                        // We updated the Droppable component so it would accept an `id`
                        // prop and pass it to `useDroppable`
                        <Droppable key={id} id={id} className={`${colors[key]} w-[400px] h-full text-center flex-shrink-0 rounded-md border-2`}>
                            <div>
                                <p className="text-xl font-medium py-6 uppercase">{estados[key]}</p>
                                {parent === id ? draggableMarkup : 'Drop here'}
                            </div>
                            {console.log(parent)}
                        </Droppable>
                    ))}
                
            </DndContext>
            </div>
        </>
    )
    function handleDragEnd(event) {
        const {over} = event;
    
        // If the item is dropped over a container, set it as the parent
        // otherwise reset the parent to `null`
        setParent(over ? over.id : null);
      }
}