
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";

const API_URL = 'http://localhost:3000/api';

const ButtonAddIssue = ({ isOpen, setIsOpen, handleSubmit, info }) => {

    return (
        <div className="">
            <button
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
               <span>Add card</span>
          <FiPlus />
            </button>
            <SpringModal info={info} handleSubmit={handleSubmit} isOpen={isOpen} setIsOpen={setIsOpen}   />
        </div>
    );
};

const SpringModal = ({ isOpen, setIsOpen, handleSubmit, info }) => {

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
                >
                    <motion.div
                        // initial={{ scale: 0, rotate: "50deg" }}
                        // animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-br from-neutral-600 to-zinc-300 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
                    >
                        <FiPlus className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
                        <div className="relative z-10">
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                                    <FiAlertCircle />
                                </div>
                                <h3 className="text-3xl font-bold text-center mb-2">
                                    New issue
                                </h3>
                                <p className="text-center mb-6">
                                    Complete all fields to create a new issue
                                </p>

                                {FIELDS.map((field, key) => <InputData key={key} field={field} info={info} />)}
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                                    >
                                        ¡Crear!
                                    </button>

                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const InputData = ({ field, info }) => {
    const [data, setData] = useState('')

    return (
        <div className="grid grid-cols-2 m-2 ">{
            
            <span className=" text-right mr-2">
                <label htmlFor={field} className=" capitalize">{field === 'assignedUserId' ? 'Assigned User ID' : field.replace('_', ' ')}</label>
            </span>
            }
            <span>
                {
                    field === "nom_issue"
                        ? <input id={field} className="text-black p-1 rounded" onChange={(e) => { setData(e.target.value) }} type='text' />
                        : <OtherInputs info={info} field={field}/>
                }
            </span>
        </div>
    )
}

const OtherInputs = ({field, info}) => {
    if (field === "estado_issue"){ 
        return <Estados field={field} info={info}/>
    }
    if (field === "priority"){
        return <Priority field={field} />
    }
    if (field === "tipo_issue"){
        return <Tipos field={field} />
    }if (field === "assignedUserId") {
        return <TextNumber field={field} />
    }
}

const TextNumber = ({ field }) => {
    const [defaultValue, setDefaultValue] = useState('')

    return (
         <input id={field}  type="number" className="text-black p-1 rounded" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)}/>
    )
}

const Tipos = ({field}) => {
    const [tipos, setTipos] = useState([]);
    const [defaultValue, setDefaultValue] = useState('')

    useEffect(() => {
        const opcions = {
            credentials: 'include',
        };
        fetch(API_URL + '/issue/tipos', opcions)
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setTipos(data);
                    setDefaultValue(data[0]);
                }
            });
    }, []);

    return(
        <select id={field} value={defaultValue}  onChange={(e) => {setDefaultValue(e.target.value)}} className="text-black capitalize p-1 rounded">
            {tipos.map((tipo, i) => <option key={i} value={tipo} className=" capitalize text-black" >{tipo}</option>)}
        </select>
    )
}

const Priority = ({field}) => {
    const [priorities, setPriorities] = useState([]);
    const [defaultValue, setDefaultValue] = useState('')

    useEffect(() => {
        const opcions = {
            credentials: 'include',
        };
        fetch(API_URL + '/issue/priority', opcions)
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setPriorities(data);
                    setDefaultValue(data[0]);
                }
            });
    }, []);

    return (
        <select id={field} value={defaultValue}  onChange={(e) => {setDefaultValue(e.target.value)}} className="text-black capitalize p-1 rounded">
            {priorities.map((priority, i) => <option key={i} value={priority} className=" capitalize text-black" >{priority}</option>)}
        </select>
    )
}

const Estados = ({ field, info }) => {
    const [estados, setEstados] = useState([]);
    const [defaultValue, setDefaultValue] = useState(info)
    useEffect(() => {
        const opcions = {
            credentials: 'include',
        };
        fetch(API_URL + '/issue/estados', opcions)
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setEstados(data);
                }
            });
    }, []);

    return (
        <select id={field} value={defaultValue}  onChange={(e) => {setDefaultValue(e.target.value)}} className="text-black capitalize p-1 rounded">
            {estados.map((estado, i) => <option key={i} value={estado} className=" capitalize text-black" >{estado}</option>)}
        </select>
    )
}

const FIELDS = ["nom_issue", "tipo_issue", "priority", "estado_issue", "assignedUserId"]

export default ButtonAddIssue;