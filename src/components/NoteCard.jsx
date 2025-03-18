import { useRef, useEffect, useState } from "react";
import { db, client } from "../appwrite/databases";
import Trash from "../icons/Trash";
import { setNewOffset, autoCardSize, cardToTop, parser, subscribe } from "../utils";

const NoteCard = ({ note }) => {
    const [saving, setSaving] = useState(false);
    const saveTimer = useRef(null);

    const body = parser(note.body);
    const [newBody, setNewBody] = useState(body);
    const [position, setPosition] = useState(JSON.parse(note.position));
    const [isDragging, setIsDragging] = useState(false);
    const colors = JSON.parse(note.colors);

    let mouseStartPos = { x: 0, y: 0 };
    const cardRef = useRef(null);

    const textAreaRef = useRef(null);

    const mouseDown = (e) => {
        mouseStartPos = { x: e.clientX, y: e.clientY };
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
        setIsDragging(true);

        cardToTop(cardRef);
    };

    const mouseMove = (e) => {
        const mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        }

        mouseStartPos = { x: e.clientX, y: e.clientY };

        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
        setPosition(newPosition);
    };

    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
        setIsDragging(false);

        const newPosition = setNewOffset(cardRef.current);
        saveData('position', newPosition);        
    };

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.log(error);
        }

        setSaving(false);
    }

    const handleKeyUp = () => {
        setSaving(true);

        if (saveTimer.current) {
            clearTimeout(saveTimer.current);
        }

        saveTimer.current = setTimeout(() => {
            saveData('body', textAreaRef.current.value);
        }, 1000);
    };

    const handleInputChange = (e) => {
        setNewBody(e.target.value);
    };

    useEffect(() => {
        autoCardSize(textAreaRef);

        const unsubscribe = subscribe(client, note, setNewBody, setPosition);

        return () => {
            unsubscribe();
        };
    }, [note.$id]);
 
    return (
        <div
            ref={cardRef}
            className={`card ${!isDragging ? 'transition' : ''}`}
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            <div
                className="card-header"
                onMouseDown={mouseDown}
                style={{ backgroundColor: colors.colorHeader }}
            >
                <Trash />
                {
                    saving && (
                        <div className="saving">
                            <span style={{ color: colors.colorText }}>Saving...</span>
                        </div>
                    )
                }
            </div>
            <div className="card-body">
                <textarea
                    ref={textAreaRef}
                    onKeyUp={handleKeyUp}
                    style={{ color: colors.colorText }}
                    value={newBody}
                    onChange={handleInputChange}
                    onInput={() => autoCardSize(textAreaRef)}
                    onFocus={() => cardToTop(cardRef)}
                ></textarea>
            </div>
        
        </div>
    );
};


export default NoteCard;
