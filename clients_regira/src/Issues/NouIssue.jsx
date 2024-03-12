
import { useEffect, useState } from "react";

import { useNavigate, useParams } from 'react-router-dom';


const API_URL = 'http://localhost:3000/api';


export default () => {
    const {idProj} = useParams()
    const [nom_issue, setNomIssue] = useState('Problema Nuevo');
    const [estados, setEstados] = useState([]);
    const [estado_issue, setEstado] = useState();
    const [error, setError] = useState(false)
    
    const opcions = {
        credentials: 'include',
    }

    useEffect(() => {
        fetch(API_URL + '/projectes/estados', opcions)
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    setError(true)
                } else {
                    setEstados(data);
                    setEstado(data[0])
                }
            })
    }, [])

    const crearPrjecte = (e) => {

        e.preventDefault();
        
            const data = {
            nom_issue,
            estado_issue,
            idProjecte : idProj
        }
        console.log(data)

            const options = {
              method: "POST",
            headers: {
                    'Content-Type': 'application/json',
                },
              body: JSON.stringify(data),
              credentials: 'include',
            }
        
            fetch(API_URL+'/issue' , options)
              .then(res => res.json())  
              .then(data => {
                console.log("resp", data);
              })
              .catch(cosa => console.log(cosa))
    
          }

    
    if (error) {
        return <h1 className='text-red-500'>{error}</h1>
    }

    return (

        <div className="w-full max-w-md">
            <form onSubmit={crearPrjecte} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nom_issue">
                        Nom
                    </label>
                    <input
                        onInput={(e) => setNomIssue(e.target.value)}
                        value={nom_issue}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="nom_issue" type="text" placeholder="Nom" />
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nom_issue">
                        Estado
                    </label>
                    <select name="estados" className=" capitalize" onChange={(e) => setEstado(e.target.vale)}>
                        {estados.map((estadoM,key) => (
                            <option key={key} value={estadoM} className=" capitalize">
                                {estadoM}
                            </option>
                        ))}
                    </select>
                </div>

                <div >
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Desar
                    </button>

                </div>
            </form>

        </div>

    )
}


