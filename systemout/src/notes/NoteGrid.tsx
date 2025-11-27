import React from "react";
import { Card, Col, Row, Button } from 'react-bootstrap';
import { Note } from "../types/note";
import { Link } from "react-router-dom";

interface NoteGridProps {
  notes: Note[];
  onNoteDeleted: (noteId:number) => void;
}

const NoteGrid: React.FC<NoteGridProps> = ({notes, onNoteDeleted}) => {
  return (
    <div>
      <Row xs={1} sm={2} md={3} lg={3} className="g-4">
        {notes.map(note => (
          <Col key={note.NoteId}>
            <Card>
              <Card.Body>
                <Card.Title><Link className="link" to={`/notedetails/${note.NoteId}`}>{note.Title}</Link></Card.Title>
                <hr />
                <Card.Text>
                  {note.Body}
                </Card.Text>
                <hr />
                <div className="d-flex justify-content-between">
                  <Button href={`/notedetails/${note.NoteId}`} variant="outline-success">Comment</Button>
                  <Button onClick={(event) => onNoteDeleted(note.NoteId)} variant="outline-danger">Delete</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default NoteGrid;