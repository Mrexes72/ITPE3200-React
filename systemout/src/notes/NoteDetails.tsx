import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Note } from '../types/note';
import * as NoteService from './NoteService';
import CommentsSection from '../comments/CommentsSection';
import CommentModal from '../comments/CommentModal';
import { Comment } from '../types/comment';

const NoteDetails: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const navigate = useNavigate();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const handleOpenCommentModal = () => setShowCommentModal(true);
  const handleCloseCommentModal = () => setShowCommentModal(false);

  const handleCommentChanged = (newComment: Comment) => {
    setComments([...comments, newComment]);
  };

  const handleNoteDeleted = async (noteId:number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this note?');
    if (confirmDelete){
      try {
        await NoteService.deleteNote(noteId);
        console.log("Note deleted", noteId);
        navigate(-1)
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

 
  useEffect(() => {
    // Simulerer en API-kall for å hente notatdetaljer basert på noteId
    const fetchNote = async () => {
      try {
        const data = await NoteService.fetchNoteById(noteId);
        setNote(data);
      } catch (error) {
        console.error('Error fetching note:', error);
      }
    };

    fetchNote();
  }, [noteId]);

  if (!note) {
    return <p>Loading...</p>;
  }

  return (

    <div className='container'>
      <h2 className='text-center'>Note display</h2>
      <hr/>
      <Row>
        <Col>
          <Card className='p-3'>
            <Card.Body style={{ display: 'inlineblock'}}>
              <Card.Title>{note.Title}</Card.Title>
              <hr />
              <Card.Text>{note.Body}</Card.Text>
              <div className='p-2'/>
              <Button variant="outline-primary" onClick={handleOpenCommentModal}>
                Add Comment
              </Button>
              <div className='p-2'/>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <CommentsSection NoteId={Number(noteId)} />
        </Col>
      </Row>
      <div>
        {/* Kommentar-modal */}
        <CommentModal
          show={showCommentModal}
          handleClose={handleCloseCommentModal}
          onCommentChanged={handleCommentChanged}
          noteId={Number(noteId)}
        />
      </div>
      <div className='p-1'/>
      <Button href={`/noteupdate/${note.NoteId}`} size='lg' variant="success">Update note</Button>
      <Button onClick={() => handleNoteDeleted(note.NoteId)} size='lg' variant="danger" style={{marginLeft: "0.5rem"}}>Delete note</Button>
      <div className='p-2'/>
      <Button variant='secondary' size='lg' onClick={() => navigate(-1)}>Back</Button>
    </div>
   
  );
};

export default NoteDetails;