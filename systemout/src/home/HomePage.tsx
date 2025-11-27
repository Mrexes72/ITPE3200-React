import React from "react";
import '../index.css';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';
import API_URL from "../apiConfig";


const HomePage: React.FC = () => {
  return (
      <Carousel>
      <Carousel.Item>
        <Image src={`${API_URL}/images/index/note5.jpg`} className="d-block w-100" alt="notes" style={{ maxHeight: '80vh' }} />
        <Carousel.Caption className="frontpage">
          <h1 style={{fontSize: '2vw'}}>Welcome to SystemOut!</h1>
          <p style={{ fontSize: '1.75vw' }}>Here you can share your favorite poems, recipes or thoughts with the world. </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Image src={`${API_URL}/images/bruker4/bruker4.jpg`} className="d-block w-100" alt="image" style={{ maxHeight: '80vh' }} />
        <Carousel.Caption className="frontpage">
          <p style={{ fontSize: '1.75vw' }}>You can also share photos from your last adventure and share photos from your upcoming ones.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Image src={`${API_URL}/images/index/note6.jpg`} className="d-block w-100" alt="notes" style={{ maxHeight: '80vh' }} />
        <Carousel.Caption className="frontpage">
          <h1 style={{fontSize: '2vw'}}>Let's get started!</h1>
          <p style={{ fontSize: '1.75vw' }}>I look forward to seeing your next post. You can create your own user by pressing Explore and then "Create new user"</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default HomePage;