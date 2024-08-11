
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { FaPencilAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

const API_URL = 'http://localhost:3000/api';

const ButtonEditIssue = ({ isOpen, setIsOpen, handleSubmit, issue }) => {
    return (
        <div className="">
            <button
                onClick={() => setIsOpen(true)}
                className=""
            >
                <span><i className="fa-solid fa-pencil"></i></span>
            </button>
            <SpringModal issue={issue} handleSubmit={handleSubmit} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
};

const SpringModal = ({ isOpen, setIsOpen, handleSubmit, issue }) => {

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
                                    <FaPencilAlt />
                                </div>
                                <h3 className="text-3xl font-bold text-center mb-2">
                                    Edit issue
                                </h3>
                                <p className="text-center mb-6">
                                    Edit all what do you need.
                                </p>
                                <div className="flex justify-center items-center">
                                    <InputData issue={issue} />
                                </div>
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
                                        Editar
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

const InputData = ({ issue }) => {
    const newFields = fields(issue)
    // 

    return (
        <div className="">
            <span className=" text-right mr-2">

            </span>
            {
                newFields.map((field, key) => <Inputs key={key} field={field} info={issue[field]} />)
            }
        </div>
    )
}

const Inputs = ({ field, info }) => {
    if (field === "nom_issue") {
        return <TextNumber field={field} info={info} type="text" />
    }
    if (field === "estado_issue") {
        return <Estados field={field} info={info} />
    }
    if (field === "priority") {
        return <Priority field={field} info={info} />
    }
    if (field === "tipo_issue") {
        return <Tipos field={field} info={info} />
    }
    if (field === "assignedUserId") {
        return <TextNumber field={field} info={info } type="number" />
    }
    return
}

const TextNumber = ({ field, type, info }) => {
    const [defaultValue, setDefaultValue] = useState(info || '')

    return (
        <div className="grid grid-cols-2 mb-2">
            <span className=" text-right mr-2">
                <label className=" capitalize">{field.replace('_', ' ')}</label>
            </span>
            <span>
                <input id={field} type={type} className="text-black p-1 rounded" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)}/>
            </span>
        </div>
    )
}

const Tipos = ({ field, info }) => {
    const [tipos, setTipos] = useState([]);
    const [defaultValue, setDefaultValue] = useState(info)

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
                }
            });
    }, []);

    return (

        <SelectForms field={field} arr={tipos} value={defaultValue} setValue={setDefaultValue} />
    )
}

const Priority = ({ field, info }) => {
    const [priorities, setPriorities] = useState([]);
    const [defaultValue, setDefaultValue] = useState(info)

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
        <SelectForms field={field} arr={priorities} value={defaultValue} setValue={setDefaultValue} />
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
        <SelectForms field={field} arr={estados} value={defaultValue} setValue={setDefaultValue} />
    )
}

const SelectForms = ({ field, arr, value, setValue }) => {
    return (
        <div className="grid grid-cols-2 mb-2">
            <span className=" text-right mr-2">
                <label className=" capitalize">{field.replace('_', ' ')}</label>
            </span>
            <span>
                <select id={field} value={value} onChange={(e) => { setValue(e.target.value) }} className="text-black capitalize p-1 rounded">
                    {arr.map((value, key) => <option key={key} value={value} className=" capitalize text-black" >{value}</option>)}
                </select>
            </span>
        </div>
    )
}

const fields = (issue) => {
    return Object.keys(issue);
}

export default ButtonEditIssue;