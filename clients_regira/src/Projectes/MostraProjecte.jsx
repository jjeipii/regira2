import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import { useParams } from "react-router-dom";

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
                    return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
                })}
                <DropIndicator beforeId={null} estado_issue={estado_issue} />
                <AddCard estado_issue={estado_issue} setIssues={setIssues} idProj={idProj}/>
            </div>
        </div>
    );
};

const Card = ({ nom_issue, id, estado_issue, handleDragStart }) => {
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
                <p className="text-sm text-neutral-100">{nom_issue}</p>
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
            body: JSON.stringify(delIssue),
            credentials: 'include',
          }
        

        setIssues((pv) => pv.filter((c) => c.id.toString() !== issueId));


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

const AddCard = ({ estado_issue, setIssues, idProj }) => {
    const [text, setText] = useState("");
    const [adding, setAdding] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim().length) return;

        const newIssue = {
            estado_issue,
            nom_issue: text.trim(),
            idProjecte: idProj
        };
        console.log(newIssue);

        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newIssue),
            credentials: 'include',
        }

        fetch(API_URL + '/issue/new', options)
            .then(res => res.json())
            .then(data => {
                console.log("resp", data);
            })
            .catch(cosa => console.log(cosa))

        setIssues((pv) => [...pv, newIssue]);
        setAdding(false);
    };

    return (
        <>
            {adding ? (
                <motion.form layout onSubmit={handleSubmit}>
                    <textarea
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                        placeholder="Add new task..."
                        className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
                    />
                    <div className="mt-1.5 flex items-center justify-end gap-1.5">
                        <button
                            onClick={() => setAdding(false)}
                            className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
                        >
                            <span>Add</span>
                            <FiPlus />
                        </button>
                    </div>
                </motion.form>
            ) : (
                <motion.button
                    layout
                    onClick={() => setAdding(true)}
                    className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
                >
                    <span>Add issue</span>
                    <FiPlus />
                </motion.button>
            )}
        </>
    );
};
