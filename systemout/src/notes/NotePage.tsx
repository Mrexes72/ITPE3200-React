import React, { useState, useEffect } from "react";
import {  Button, Form } from 'react-bootstrap';
import NoteGrid from "./NoteGrid";
import { Note } from "../types/note";
import * as NoteService from './NoteService';

const NotePage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading ] = useState<boolean>(false);
  const [error, setError ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchNotes = async () =>{
    setLoading(true);
    setError(null);

    try{
      const data = await NoteService.fetchNotes();
      setNotes(data);
    } catch (error) {
      console.error(`There was a problem with the fetch operation: ${error.message}`);
      setError('Failed to fetch notes.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note =>
    note.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.Body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNoteDeleted = async (noteId:number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this note?');
    if (confirmDelete){
      try {
        await NoteService.deleteNote(noteId);
        setNotes(prevNote => prevNote.filter(note => note.NoteId !== noteId));
        console.log("Note deleted", noteId);
      } catch (error) {
        console.error('Error deleting note:', error);
        setError('Failed to delete note.');
      }
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', paddingBottom: "15px" }}>Notes</h1>
      <Button onClick={fetchNotes} size="lg" style={{ fontWeight: 'bold' }} variant="outline-primary mb-3 me-2" disabled={loading}>
        { loading ? 'Loading...' : 'Refresh Notes'}
      </Button>
      <Form.Group className="mb-3">
        <Form.Control
        type="text"
        placeholder="Search by title or body"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        />
      </Form.Group>
      <hr />
      {error && <p style={{ color: 'red'}}>{error}</p>}
      <NoteGrid notes={filteredNotes}  onNoteDeleted={handleNoteDeleted}/>
    </div>
  );
};

export default NotePage;