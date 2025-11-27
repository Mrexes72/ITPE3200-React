import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col } from 'react-bootstrap';
import ImageForm from "../images/ImageForm";
import { Image } from "../types/image";
import * as ImageService from '../images/ImageService';
import NoteForm from "../notes/NoteForm";
import { Note } from "../types/note";
import * as NoteService from '../notes/NoteService';
import API_URL from "../apiConfig";

const UploadPage: React.FC = () => {
  const navigate = useNavigate();

  // State for forhåndsvisning av bilde
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [previewDescription, setPreviewDescription] = useState<string>("");

  const handleNoteCreated = async (note: Note) => {
    try {
      const data = await NoteService.createNote(note);
      console.log('Note Created successfully', data);
      navigate('/notes');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleImageCreated = async (image: Image) => {
    try {
      const data = await ImageService.createImage(image);
      console.log('Image Created successfully', data);
      navigate('/images');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  // Funksjon for å oppdatere forhåndsvisningen av bildet
  const handleImagePreview = (url: string, title: string, description: string) => {
    if (url && url.trim() !== '') { // Sjekk om URL er gyldig
      setPreviewUrl(`${API_URL}${url}`);
      setPreviewTitle(title);
      setPreviewDescription(description);
    } else {
      setPreviewUrl(''); // Fjern forhåndsvisningen hvis URL er tom
      setPreviewTitle('');
      setPreviewDescription('');
    }
  };
  

  return (
    <div className="container mt-4">
      <h1 style={{ textAlign: 'center', fontSize: '3rem', paddingBottom: "15px" }}>Upload a new post</h1>
      <hr />
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="p-3" style={{ textAlign: 'center', fontWeight: 'bolder', fontSize: '28px' }}>Create new Image</Card.Title>
              <hr />
              <ImageForm 
                onImageChanged={handleImageCreated} 
                isUpdate={false}
                onImagePreview={handleImagePreview} // Send preview-funksjonen til ImageForm
              />
            </Card.Body>
          </Card>
          {/* Forhåndsvisning av bildet */}
            {previewUrl && previewUrl.trim() !== '' ? (
              <Card className="p-3">
                <Card.Img variant="top" src={previewUrl} />
                <Card.Body>
                  <Card.Title>{previewTitle}</Card.Title>
                  <Card.Text>
                    {previewDescription}
                  </Card.Text>
                </Card.Body>
              </Card>
            ) : (
              <p style={{ textAlign: 'center', color: 'gray' }}>Select a URL to preview the image</p>
            )}
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="p-3" style={{ textAlign: 'center', fontWeight: 'bolder', fontSize: '28px' }}>Create new Note</Card.Title>
              <hr />
              <NoteForm onNoteChanged={handleNoteCreated} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
        
    </div>
  );
};

export default UploadPage;
