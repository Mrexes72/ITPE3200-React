import React from "react";
import { Card, Col, Row, Button, Image } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { User } from '../types/user';
import { Image as UserImage } from "../types/image";
import { Note } from "../types/note";
import API_URL from "../apiConfig";

interface ExploreGridProps {
  users: User[];
  images?: UserImage[];
  notes?: Note[];
  onUserDeleted: (userId: number) => void;
}

const ExploreGrid: React.FC<ExploreGridProps> = ({ users, images = [], notes = [], onUserDeleted }) => {

  const navigate = useNavigate();

  return (
    <div>
      {users.map(user => (
        <div key={user.UserId} className="mb-4">
           {/* Profilbilde og brukernavn */}
           <Row className="align-items-center mb-3">
            <Col xs="auto"> 
              <Image 
                src={`${API_URL}${user.ImageUrl}`} 
                roundedCircle 
                width={50} 
                height={50} 
                alt={`${user.Name}'s profile`} 
              />
            </Col>
            <Col xs="auto">
              <h2>{user.Name}</h2>
            </Col>
            <Col xs="auto">
              {/* Legg til et ikon for å oppdatere brukeren */}
              <img 
                src="/pen.png" 
                alt="Edit Profile" 
                width={30} 
                height={30} 
                style={{ cursor: 'pointer' }} 
                onClick={() => navigate(`/userupdate/${user.UserId}`)} // Legg til ønsket funksjonalitet her
              />
            </Col>
          </Row>
          
          {/* Brukerens bilder og notater på samme linje */}
          <Row xs={1} sm={2} md={3} lg={3} className="g-3">
            
            {/* Filtrer og vis bilder for brukeren */}
            {images
              .filter(image => image.UserId === user.UserId)
              .map(image => (
                <Col key={image.ImageId}>
                  <Card className="p-3">
                    <Card.Img variant="top" src={`${API_URL}${image.Url}`} />
                    <Card.Body>
                      <Card.Title>
                        <Link className="link" to={`/imagedetails/${image.ImageId}`}>{image.Title}</Link>
                      </Card.Title>
                      <Card.Text>{image.Description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}

            {/* Filtrer og vis notater for brukeren */}
            {notes
              .filter(note => note.UserId === user.UserId)
              .map(note => (
                <Col key={note.NoteId}>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <Link className="link" to={`/notedetails/${note.NoteId}`}>{note.Title}</Link>
                      </Card.Title>
                      <Card.Text> By {user.Name} </Card.Text>
                      <Card.Text>{note.Body}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
          
          {/* Slett bruker-knappen for hver bruker */}
          <Button onClick={() => onUserDeleted(user.UserId)} variant="outline-danger" className="mt-3">
            Delete {user.Name}
          </Button>

          {/* Avstand mellom hver bruker */}
          <hr className="my-4" />
        </div>
      ))}
    </div>
  );
};

export default ExploreGrid;
