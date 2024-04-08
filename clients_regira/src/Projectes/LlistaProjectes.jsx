import { useState, useEffect, React } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';

export default () => {

    const [projectes, setProjectes] = useState([])
    const [error, setError] = useState(false)

    const opcions = {
        credentials: 'include',
    }

    useEffect(() => {
        fetch(API_URL + '/projectes', opcions)
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error)
                    setError(true)
                } else {
                    setProjectes(data);
                }
            })
    }, [])

    if (error) {
        return <h1 className='text-red-500'>Validate perro!</h1>
    }

    return (<>
        <h1>Llista de projectes</h1>


        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table
                            className="min-w-full text-left text-sm font-light text-surface ">
                            <thead
                                className="border-b border-neutral-200 font-medium ">
                                <tr>
                                    <th scope="col" className="px-6 py-4">#</th>
                                    <th scope="col" className="px-6 py-4">Nom</th>
                                    <th scope="col" className="px-6 py-4">Descripción</th>
                                    <th scope="col" className="px-6 py-4">Editar</th>
                                </tr>
                            </thead>
                            <tbody>

                                {projectes.map(bolet =>
                                (
                                <tr  key={bolet.id} className="border-b border-neutral-200">
                                    
                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{bolet.id}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{bolet.nom_projecte}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{bolet.desc_projecte}</td>
                                    <td className="whitespace-nowrap px-9 py-4 "><Link to={`/projecte/${bolet.id}`}><i className="fa-solid fa-pencil"></i></Link></td>
                                    
                                </tr>
                               )
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>   
    </>)



}