import React, {useState, useEffect} from "react";
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import NoteForm from "./NoteForm";
import { Note } from "../types/note";
import * as NoteService from './NoteService';

const NoteUpdatePage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string}>();
  const navigate = useNavigate();
  const [ note, setNote ] = useState<Note | null>(null);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try{
        const data = await NoteService.fetchNoteById(noteId);
        setNote(data);
      } catch (error) {
        setError('Failed to fetch note');
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  const handleNoteUpdated = async (note:Note) => {
    try {
      const data = await NoteService.updateNote(note.NoteId, note);
      console.log('Note update was successful:', data);
      navigate('/notes');
    } catch (error){
      console.error('There was a problem with the fetch operation', error);
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!note) return <p>No Image Found</p>

  return(
    <div className="container mt-4">
      <h2 style={{ textAlign: 'center' }}>Update Note</h2>
      <Row>
        <Col md={6} className="mx-auto">
          <Card>
            <Card.Body>
            <NoteForm onNoteChanged={handleNoteUpdated} NoteId={note.NoteId} isUpdate={true} initialData={note} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NoteUpdatePage;