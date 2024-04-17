import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import { useParams } from "react-router-dom";
import ButtonAddIssue from "../Issues/NewIssue"
import EditIssue from "../Issues/EditIssue"

const API_URL = 'http://localhost:3000/api';
const colors = ['text-red-200', 'text-yellow-200', 'text-blue-200', 'text-purple-200', 'text-green-200', 'text-neutral-200'];

export const MostraProjecte = () => {
    return (
        <div className="h-screen w-full bg-neutral-900 text-neutral-50">
            <Board />
        </div>
    );
};

const Board = () => {
    const { idProj } = useParams();
    const [issues, setIssues] = useState([]);
    const [estados, setEstados] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const opcions = {
            credentials: 'include',
        };
        fetch(API_URL + '/issue/estados', opcions)
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    
                } else {
                    setEstados(data);
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
                    console.error(data.error);
                } else {
                    setIssues(data);

                }
            });
    }, []);
    


    return (
        <div className="flex h-full w-full gap-3 overflow-scroll p-12">
            {
                estados.map((estado, key) =>
                    <Column
                        key={key}
                        nom_issue={estado}
                        estado_issue={estado}
                        headingColor={`${colors[key]}`}
                        idProj={idProj}
                        issues={issues}
                        setIssues={setIssues}
                    />)
            }

            <BurnBarrel issues={issues} setIssues={setIssues} />
        </div>
    );
};

const Column = ({ nom_issue, headingColor, issues, estado_issue, setIssues, idProj }) => {
    const [active, setActive] = useState(false);

    const handleDragStart = (e, issue) => {
        e.dataTransfer.setData("issueId", issue.id);
    };

    const handleDragEnd = (e) => {
        const issueId = e.dataTransfer.getData("issueId");

        setActive(false);
        clearHighlights();

        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);

        const before = element.dataset.before || "-1";

        if (before !== issueId) {
            let copy = [...issues];

            let cardToTransfer = copy.find((c) => c.id.toString() === issueId);
            if (!cardToTransfer) return;

            cardToTransfer = { ...cardToTransfer, estado_issue };

            copy = copy.filter((c) => c.id.toString() !== issueId);

            const moveToBack = before === "-1";

            if (moveToBack) {
                copy.push(cardToTransfer);
            } else {
                const insertAtIndex = copy.findIndex((el) => el.id.toString() === before);
                if (insertAtIndex === undefined) return;

                copy.splice(insertAtIndex, 0, cardToTransfer);
            }
            console.log(cardToTransfer.id)

            const options = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardToTransfer),
                credentials: 'include',
            }
    
            fetch(API_URL + `/issues/${cardToTransfer.id}`, options)
                .then(res => res.json())
                .then(data => {
                    console.log("resp", data);
                })
                .catch(cosa => console.log({error: cosa}))
    
            ;

            setIssues(copy);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        highlightIndicator(e);

        setActive(true);
    };

    const clearHighlights = (els) => {
        const indicators = els || getIndicators();

        indicators.forEach((i) => {
            i.style.opacity = "0";
        });
    };

    const highlightIndicator = (e) => {
        const indicators = getIndicators();

        clearHighlights(indicators);

        const el = getNearestIndicator(e, indicators);

        el.element.style.opacity = "1";
    };

    const getNearestIndicator = (e, indicators) => {
        const DISTANCE_OFFSET = 50;

        const el = indicators.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();

                const offset = e.clientY - (box.top + DISTANCE_OFFSET);

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            }
        );

        return el;
    };

    const getIndicators = () => {
        return Array.from(document.querySelectorAll(`[data-estado_issue="${estado_issue}"]`));
    };

    const handleDragLeave = () => {
        clearHighlights();
        setActive(false);
    };

    const filteredCards = issues.filter((c) => c.estado_issue === estado_issue);

    return (
        <div className="w-56 shrink-0">
            <div className="mb-3 flex items-center justify-between">
                <h3 className={`font-medium ${headingColor}`}>{nom_issue}</h3>
                <span className="rounded text-sm text-neutral-400">
                    {filteredCards.length}
                </span>
            </div>
            <div
                onDrop={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`h-full w-full transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"
                    }`}
            >
                {filteredCards.map((c) => {
                    return <Card key={c.id} {...c} issue={c} setIssues={setIssues} handleDragStart={handleDragStart} idProj={idProj} />;
                })}
                <DropIndicator beforeId={null} estado_issue={estado_issue} />
                <AddCard estado_issue={estado_issue} setIssues={setIssues} idProj={idProj}/>
            </div>
        </div>
    );
};

const Card = ({ nom_issue, id, estado_issue,issue, handleDragStart, idProj }) => {
    const [edit, setEdit] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(e.target['nom_issue'].value === '' || e.target['estado_issue'].value === '') return
        let getData = (e) => {
            
            let cpIssue = {...issue}
            delete cpIssue.id;

            for (let index = 0; index < e.target.length-2; index++) {
                cpIssue[e.target[index].id] = e.target[index].value 
            }
            return (cpIssue)
        }

        const sendIssue = {...getData(e)}

        const options = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sendIssue),
            credentials: 'include',
        }

        fetch(API_URL + `/issues/${id}`, options)
            .then(res => res.json())
            .then(data => {
                console.log("resp", data);
                setIssues(sendIssue)
            })
            .catch(cosa => console.log(JSON.parse(cosa)))

        ;
        setEdit(false);
    };

    return (
        <>
            <DropIndicator beforeId={id} estado_issue={estado_issue} />
            <motion.div
                layout
                layoutId={id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, { nom_issue, id, estado_issue })}
                className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
            >
                <div className="text-sm text-neutral-100 flex justify-between"><span>{nom_issue}</span><EditIssue issue={issue} handleSubmit={handleSubmit} isOpen={edit} setIsOpen={setEdit}/></div>
            </motion.div>
        </>
    );
};

const DropIndicator = ({ beforeId, estado_issue }) => {
    return (
        <div
            data-before={beforeId || "-1"}
            data-estado_issue={estado_issue}
            className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
        /> 
    );
};

const BurnBarrel = ({ issues, setIssues }) => {
    const [active, setActive] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    const handleDragEnd = (e) => {
        const issueId = e.dataTransfer.getData("issueId");
        
        let cpIssue = [...issues]
        let delIssue = cpIssue.find((c) => c.id.toString() === issueId).id
 
        const options = {
            method: "DELETE",
            headers: {
                  'Content-Type': 'application/json',
              },
            body: JSON.stringify({id:delIssue}),
            credentials: 'include',
          }

        setIssues((pv) => pv.filter((c) => c.id.toString() !== issueId));
        
        fetch(API_URL + '/issue/delete', options)
            .then(res => res.json())
            .then(data => {
                console.log("resp", data);
            })
            .catch(cosa => console.log(cosa))

        setActive(false);
    };

    return (
        <div
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${active
                ? "border-red-800 bg-red-800/20 text-red-500"
                : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
                }`}
        >
            {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
        </div>
    );
};

const AddCard = ({ estado_issue, setIssues, idProj}) => {
    const [adding, setAdding] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if(e.target['nom_issue'].value === '' || e.target['estado_issue'].value === '') return

        let getData = (e) => {
            let data = {}
            for (let index = 0; index < e.target.length-2; index++) {
            data = {...data, [e.target[index].id]:e.target[index].value}
            }
            return data
        }

        const sendIssue = {...getData(e), idProjecte: idProj}

        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sendIssue),
            credentials: 'include',
        }

        fetch(API_URL + '/issue/new', options)
            .then(res => res.json())
            .then(data => {
                console.log("resp", data);
                setIssues((pv) => [...pv, data])
            })
            .catch(cosa => console.log(JSON.parse(cosa)))

        ;
        setAdding(false);
    };

    return (
        <ButtonAddIssue handleSubmit={handleSubmit} isOpen={adding} setIsOpen={setAdding} setIssues={setIssues} info={estado_issue}></ButtonAddIssue>
    );
};
