import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Image } from '../types/image';
import * as UserService from '../users/UserService';
import * as ImageService from '../images/ImageService';
import { User } from '../types/user';

interface ImageFormProps {
  onImageChanged: (newImage: Image) => void;
  ImageId?: number;
  isUpdate?: boolean;
  initialData?: Image;
  onImagePreview: (url: string, title: string, description: string) => void;  // Legg til prop for forhåndsvisning
}

const ImageForm: React.FC<ImageFormProps> = ({
  onImageChanged,
  ImageId,
  isUpdate = false,
  initialData,
  onImagePreview // Ny prop for forhåndsvisning
}) => {
  const [Title, setTitle] = useState<string>(initialData?.Title || '');
  const [Description, setDescription] = useState<string>(initialData?.Description || '');
  const [Url, setUrl] = useState<string>(initialData?.Url || '');
  const [UserId, setUserId] = useState<number>(initialData?.UserId || null);
  const [users, setUsers] = useState<User[]>([]);
  const [allImageUrls, setAllImageUrls] = useState<string[]>([]);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1);
  };

  const handelSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const image: Image = { ImageId, Title, Description, Url, UserId };
    onImageChanged(image);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > 800) {
      setDescriptionError("The Description can't be longer than 800 characters");
    } else {
      setDescriptionError(null); // Fjern feilmeldingen hvis den er gyldig
    }
    setDescription(value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const titleRegex = /^[a-zA-ZæøåÆØÅ.\-! ]{2,70}$/;
  
    if (value.length < 2 || value.length > 70) {
      setTitleError("The Title must be between 2 and 70 characters.");
    } else if (!titleRegex.test(value)) {
      setTitleError("The Title contains invalid characters. Only letters, spaces, '.', '-', and '!' are allowed.");
    } else {
      setTitleError(null); // Fjern feilmeldingen hvis inputet er gyldig
    }
  
    setTitle(value);
  };
  

  useEffect(() => {
    // Oppdater forhåndsvisningen når Title, Description, eller Url endres
    onImagePreview(Url, Title, Description);
  }, [Title, Description, Url, onImagePreview]);

  useEffect(() => {
    // Hent alle brukere når komponenten lastes inn
    const fetchUsers = async () => {
      try {
        const userData = await UserService.fetchUsers();
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchAllImageUrls = async () => {
      try {
        const urls = await ImageService.fetchImageUrls(); // Bruker den nye ImageService-metoden
        setAllImageUrls(urls);
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      }
    };

    fetchAllImageUrls();
    fetchUsers();
  }, []);


  return (
    <Form onSubmit={handelSubmit}>
      <Form.Group controlId="formImageTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter image title"
          value={Title}
          onChange={handleTitleChange}
          required
          isInvalid={!!titleError}
        />
        <Form.Control.Feedback type="invalid">{titleError}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formImageDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Enter description"
          value={Description}
          onChange={handleDescriptionChange}
          isInvalid={!!descriptionError}
        />
        <Form.Control.Feedback type="invalid">{descriptionError}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formImageUrl">
        <Form.Label>Url</Form.Label>
        <Form.Select
          value={Url || ''}
          onChange={(e) => setUrl(e.target.value)}
        >
          <option value="">Select Url</option>
          {allImageUrls.map((url, index) => (
            <option key={index} value={url}>
              {url}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="formImageUserId" style={{ display: isUpdate ? 'none' : 'block' }}>
        <Form.Label>User</Form.Label>
        <Form.Select
          value={UserId || ''}
          onChange={(e) => setUserId(Number(e.target.value))}
          required={!isUpdate}
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.UserId} value={user.UserId}>
              {user.Name} (ID: {user.UserId})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <div style={{ paddingTop: '15px' }}>
      <Button variant="primary" type="submit" disabled={!!titleError || !!descriptionError}>
        {isUpdate ? 'Update Image' : 'Create Image'}
      </Button>
      <Button variant="secondary" onClick={onCancel} className="ms-2">
        Cancel
      </Button>
      </div>
    </Form>
  );
};

export default ImageForm;
