
import { useEffect, useState } from "react";


const API_URL = 'http://localhost:3000/api';


export default () => {
    const [nom_projecte, setNomProjecte] = useState('Problema Nuevo');
    const [error, setError] = useState(false)
    
    const opcions = {
        credentials: 'include',
    }


    const crearPrjecte = (e) => {

        e.preventDefault();
        
            const data = {
            nom_projecte,
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
        
            fetch(API_URL+'/projecte/new' , options)
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
                        onInput={(e) => setNomProjecte(e.target.value)}
                        value={nom_projecte}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="nom_issue" type="text" placeholder="Nom" />

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


