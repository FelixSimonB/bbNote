import NoteCard from "../components/NoteCard";
import { useState, useEffect } from "react";
import Controls from "../components/NoteToolbar";
import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import '../styles/notes.css';

const NotesPage = () => {
  const { notes } = useContext(NotesContext);
  return (
    <div>
      {notes.map((note) => (
        <NoteCard note={note} key={note.$id} />
      ))}
      <Controls />
    </div>
  );
};

export default NotesPage;

