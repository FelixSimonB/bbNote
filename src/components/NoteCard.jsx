import { useRef, useEffect, useState } from "react";
import { db, client } from "../appwrite/databases";
import DeleteButton from "./DeleteButton";
import Spinner from "../icons/Spinner";
import {
  setNewOffset,
  autoCardSize,
  cardToTop,
  parser,
  subscribe,
  sleep,
} from "../utils";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

const NoteCard = ({ note }) => {
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef(null);

  const { setSelectedNote } = useContext(NotesContext);

  const body = parser(note.body);
  const [newBody, setNewBody] = useState(body);
  const [colors, setColors] = useState(JSON.parse(note.colors));
  const cardRef = useRef(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    autoCardSize(textAreaRef);

    const unsubscribe = subscribe(
      client,
      note,
      textAreaRef,
      setNewBody,
      null, // No longer setting position
      setColors,
      autoCardSize
    );

    return () => {
      unsubscribe();
    };
  }, [note.$id]);

  const saveData = async (key, value) => {
    const payload = { [key]: JSON.stringify(value) };
    try {
      await db.notes.update(note.$id, payload);
    } catch (error) {
      console.log(error);
    }

    setSaving(false);
  };

  const handleKeyUp = () => {
    setSaving(true);

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(() => {
      saveData("body", textAreaRef.current.value);
    }, 1000);
  };

  const handleInputChange = (e) => {
    setNewBody(e.target.value);
  };


  return (
    <div
      ref={cardRef}
      className="card"
      style={{ backgroundColor: colors.colorBody }}
    >
      <div
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
      >
        <DeleteButton noteId={note.$id} />

        {saving && (
          <div className="card-saving">
            <Spinner color={colors.colorText} />
            <span style={{ color: colors.colorText }}>Saving...</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <textarea
          ref={textAreaRef}
          onKeyUp={handleKeyUp}
          style={{ color: colors.colorText }}
          value={newBody ?? ""}
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
