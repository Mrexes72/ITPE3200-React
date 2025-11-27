import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Image } from '../types/image';
import CommentsSection from '../comments/CommentsSection';
import CommentModal from '../comments/CommentModal';
import { Comment } from '../types/comment';
import * as ImageService from './ImageService';
import API_URL from '../apiConfig';

const ImageDetails: React.FC = () => {
  const { imageId } = useParams<{imageId : string}>();
  const [ image, setImage] = useState<Image | null>();
  const navigate = useNavigate();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const handleOpenCommentModal = () => setShowCommentModal(true);
  const handleCloseCommentModal = () => setShowCommentModal(false);

  const handleCommentChanged = (newComment: Comment) => {
    setComments([...comments, newComment]);
  };

  useEffect(() => {
    // Simulerer en API-kall for å hente notatdetaljer basert på noteId
    const fetchImage = async () => {
      try {
        const data = await ImageService.fetchImageById(imageId);
        setImage(data);
      } catch (error) {
        console.error('Error fetching note:', error);
      }
    };

    fetchImage();
  }, [imageId]);

  const handleImageDeleted = async (imageId:number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (confirmDelete){
      try {
        await ImageService.deleteImage(imageId);
        console.log("Image deleted", imageId);
        navigate(-1)
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  if (!image) {
    return <p>Loading...</p>;
  }

  return (
    <div className='container'>
      <h2 className='text-center'>Image display</h2>
      <hr />
      <Row>
        <Col>
          <Card className='p-3'>
            <Card.Img variant="top" style={{maxWidth:'100%', height:'100%'}} src={`${API_URL}${image.Url}`} />
            <Card.Body style={{ display: 'inlineblock'}}>
              <Card.Title>{image.Title}</Card.Title>
              <Card.Text>{image.Description}</Card.Text>
              <hr />
              <Button variant="outline-primary" onClick={handleOpenCommentModal}>
                Add Comment
              </Button>
              <div className='p-2'/>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <CommentsSection ImageId={Number(imageId)} />
        </Col>
      </Row>
      <div>
        {/* Kommentar-modal */}
        <CommentModal
          show={showCommentModal}
          handleClose={handleCloseCommentModal}
          onCommentChanged={handleCommentChanged}
          imageId={Number(imageId)}
        />
      </div>
      <div className='p-2'/>
      <Button href={`/imageupdate/${image.ImageId}`} size='lg' variant="success">Update image</Button>
      <Button onClick={() => handleImageDeleted(image.ImageId)} size='lg' variant="danger" style={{marginLeft: "0.5rem"}}>Delete image</Button>
      <div className='p-2'/>
      <Button variant='secondary' size='lg' onClick={() => navigate(-1)}>Back</Button>
    </div>
  );
};

export default ImageDetails;