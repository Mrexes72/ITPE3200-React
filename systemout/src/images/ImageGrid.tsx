import React from "react";
import { Card, Col, Row, Button } from 'react-bootstrap';
import { Image } from "../types/image";
import { Link } from "react-router-dom";

interface ImageGridProps {
  images: Image[];
  apiUrl: string;
  onImageDeleted: (imageId:number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({images, apiUrl, onImageDeleted}) => {
  return (
    <div>
      <Row xs={1} sm={2} md={3} lg={3} className="g-4">
        {images.map(image => (
          <Col key={image.ImageId}>
            <Card className="p-3">
              <Card.Img variant="top" src={`${apiUrl}${image.Url}`} />
              <Card.Body>
                <Card.Title><Link className="link" to={`/imagedetails/${image.ImageId}`}>{image.Title}</Link></Card.Title>
                <Card.Text>
                  {image.Description}
                </Card.Text>
                <hr />
                <div className="d-flex justify-content-between">
                  <Button href={`/imagedetails/${image.ImageId}`} variant="outline-success">Comment</Button>
                  <Button onClick={() => onImageDeleted(image.ImageId)} variant="outline-danger">Delete</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ImageGrid;