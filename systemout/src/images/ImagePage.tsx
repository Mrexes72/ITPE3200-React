import React, { useEffect, useState } from "react";
import {  Button, Form } from 'react-bootstrap';
import ImageGrid from "./ImageGrid";
import { Image } from "../types/image";
import API_URL from "../apiConfig";
import * as ImageService from './ImageService';

const ImagePage: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading ] = useState<boolean>(false);
  const [error, setError ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchImages = async () =>{
    setLoading(true);
    setError(null);

    try{
      const data = await ImageService.fetchImages();
      setImages(data);
    } catch (error) {
      console.error(`There was a problem with the fetch operation: ${error.message}`);
      setError('Failed to fetch images.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchImages();
  }, []);

  const filteredImages = images.filter(image =>
    image.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.Description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageDeleted = async (imageId:number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (confirmDelete){
      try {
        await ImageService.deleteImage(imageId);
        setImages(prevImage => prevImage.filter(image => image.ImageId !== imageId));
        console.log("Image deleted", imageId);
      } catch (error) {
        console.error('Error deleting image:', error);
        setError('Failed to delete image.');
      }
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', paddingBottom: "15px" }}>Images</h1>
      <Button onClick={fetchImages} size="lg" style={{ fontWeight: 'bold' }} variant="outline-primary mb-3 me-2"  disabled={loading}>
        { loading ? 'Loading...' : 'Refresh Images'}
      </Button>
      <Form.Group className="mb-3">
        <Form.Control
        type="text"
        placeholder="Search by title or description"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        />
      </Form.Group>
      <hr />
      {error && <p style={{ color: 'red'}}>{error}</p>}
      <ImageGrid images={filteredImages} apiUrl={API_URL} onImageDeleted={handleImageDeleted}/>
    </div>
  );
};

export default ImagePage;