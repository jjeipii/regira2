import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';

export default ({registerOn}) => {

    const [nom_usuari, setNomUsuari] = useState('Exmple');
    const [email_usuari, seteEmailUsuari] = useState('joanot@gmail.com');
    const [password, setPassword] = useState('');
    const redirect = useNavigate();


    const registra = (e) => {

        e.preventDefault();

        console.log("loguejant..", nom_usuari, email_usuari, password)

        const credencials = {
            nom_usuari,
            email_usuari,
            password
        }

        const opcions = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(credencials)
        }

        fetch(API_URL+'/register', opcions)
        .then(resp => resp.json())
        .then(data => {
            console.log("resp", data);
            redirect('/')
            
        })
        .catch(err => console.log(err))

    }


    return (



        <div className="w-full max-w-xs">
            <form onSubmit={registra} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Nombre
                    </label>
                    <input
                        onInput={(e) => setNomUsuari(e.target.value)}
                        value={nom_usuari}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="nom_usuari" type="text" placeholder="Username" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        onInput={(e) => seteEmailUsuari(e.target.value)}
                        value={email_usuari}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email_usuari" type="text" placeholder="Username" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        onInput={(e) => setPassword(e.target.value)}
                        value={password} className="shadow appearance-none border
                    rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Registrar
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={()=>registerOn(false)}>
                        Login
                    </button>
                </div>
            </form>
            <p className="text-center text-gray-500 text-xs">
                &copy;2020 Acme Corp. All rights reserved.
            </p>
        </div>

    )
}


