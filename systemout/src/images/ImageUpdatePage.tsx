import React, { useState, useEffect } from "react";
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import ImageForm from "./ImageForm";
import { Image } from "../types/image";
import * as ImageService from './ImageService';
import API_URL from "../apiConfig";

const ImageUpdatePage: React.FC = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const [image, setImage] = useState<Image | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [previewDescription, setPreviewDescription] = useState<string>("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const data = await ImageService.fetchImageById(imageId);
        setImage(data);
        setPreviewUrl(data.Url || ""); // Sett forhåndsvisningsbildet
        setPreviewTitle(data.Title || "");
        setPreviewDescription(data.Description || "");
      } catch (error) {
        setError('Failed to fetch image');
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [imageId]);

  const handleImageUpdated = async (image: Image) => {
    try {
      const data = await ImageService.updateImage(image.ImageId, image);
      console.log('Image update was successful:', data);
      navigate('/images');
    } catch (error) {
      console.error('There was a problem with the fetch operation', error);
    }
  };

  // Funksjon for å oppdatere forhåndsvisningsbildet
  const handleImagePreview = (url: string, title: string, description: string) => {
    setPreviewUrl(`${API_URL}${url}`);
    setPreviewTitle(title);
    setPreviewDescription(description);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!image) return <p>No Image Found</p>;

  return (
    <div className="container mt-4">
      <h2 style={{ textAlign: 'center' }}>Update Image</h2>
      <Row>
        <Col md={6} className="mx-auto">
          <Card>
            <Card.Body>
              <ImageForm
                onImageChanged={handleImageUpdated}
                ImageId={image.ImageId}
                isUpdate={true}
                initialData={image}
                onImagePreview={handleImagePreview} // Send inn forhåndsvisningsfunksjonen
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mx-auto">
          {previewUrl && (
            <Card className="p-3">
            <Card.Img variant="top" src={previewUrl} />
            <Card.Body>
              <Card.Title>{previewTitle}</Card.Title>
              <Card.Text>
                {previewDescription}
              </Card.Text>
            </Card.Body>
          </Card>
          )}
        </Col>
      </Row>
      
    </div>
  );
};

export default ImageUpdatePage;
