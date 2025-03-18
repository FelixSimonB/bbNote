import { useRef, useEffect, useState } from "react";
import { db, client } from "../appwrite/databases";
import DeleteButton from "./DeleteButton";
import Spinner from "../icons/Spinner";
import { setNewOffset, autoCardSize, cardToTop, parser, subscribe } from "../utils";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

const NoteCard = ({ note }) => {
    const [saving, setSaving] = useState(false);
    const saveTimer = useRef(null);
    
    const { setSelectedNote } = useContext(NotesContext);

    const body = parser(note.body);
    const [newBody, setNewBody] = useState(body);
    const [position, setPosition] = useState(JSON.parse(note.position));
    const [isDragging, setIsDragging] = useState(false);
    const [colors, setColors] = useState(JSON.parse(note.colors));

    let mouseStartPos = { x: 0, y: 0 };
    const cardRef = useRef(null);

    const textAreaRef = useRef(null);

    useEffect(() => {
        autoCardSize(textAreaRef);

        const unsubscribe = subscribe(client, note, textAreaRef, setNewBody, setPosition, setColors, autoCardSize);

        return () => {
            unsubscribe();
        };
    }, [note.$id]);

    const mouseDown = (e) => {
        if (e.target.className === "card-header") {
            mouseStartPos = { x: e.clientX, y: e.clientY };
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
            setIsDragging(true);
            cardToTop(cardRef);
            setSelectedNote(note);
        }
    };

    const touchStart = (e) => {
        if (e.target.className === "card-header") {
            mouseStartPos = { x: e.clientX, y: e.clientY };
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
            setIsDragging(true);
            cardToTop(cardRef);
            setSelectedNote(note);
        }
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

    const touchMove = (e) => {
        const touch = e.touches[0];
        const mouseMoveDir = {
            x: mouseStartPos.x - touch.clientX,
            y: mouseStartPos.y - touch.clientY,
        }

        mouseStartPos = { x: touch.clientX, y: touch.clientY };

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

    const touchEnd = () => {
        document.removeEventListener("touchmove", touchMove);
        document.removeEventListener("touchend", touchEnd);
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
                onTouchStart={touchStart}
                style={{ backgroundColor: colors.colorHeader }}
            >
                <DeleteButton noteId={note.$id} />

                {
                    saving && (
                        <div className="card-saving">
                            <Spinner color={colors.colorText} />
                            <span style={{ color: colors.colorText }}>
                                Saving...
                            </span>
                        </div>
                    )
                }
            </div>
            <div className="card-body">
                <textarea
                    ref={textAreaRef}
                    onKeyUp={handleKeyUp}
                    style={{ color: colors.colorText }}
                    value={newBody ?? ''}
                    onChange={handleInputChange}
                    onInput={() => autoCardSize(textAreaRef)}
                    onFocus={() => {
                        cardToTop(cardRef);
                        setSelectedNote(note);
                    }}
                ></textarea>
            </div>
        
        </div>
    );
};


export default NoteCard;
