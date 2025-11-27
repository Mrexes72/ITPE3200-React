import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Image } from 'react-bootstrap';
import { User } from '../types/user';
import * as ImageService from '../images/ImageService';
import API_URL from '../apiConfig';

interface UserFormProps {
  onUserChanged: (newUser: User) => void;
  UserId?: number;
  isUpdate?: boolean;
  initialData?: User;
}

const UserForm: React.FC<UserFormProps> = ({
  onUserChanged, 
  UserId,
  isUpdate = false,
  initialData}) => {
  const [Name, setName] = useState<string>(initialData?.Name || '');
  const [ImageUrl, setImageUrl] = useState<string>(initialData?.ImageUrl || '');
  const [allImageUrls, setAllImageUrls] = useState<string[]>([]);
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1); // This will navigate back one step in the history
  }

  const handelSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const user: User = {UserId, Name, ImageUrl };
    onUserChanged(user);
  }

  useEffect(() => {
    const fetchAllImageUrls = async () => {
      try {
        const urls = await ImageService.fetchImageUrls(); // Bruker den nye ImageService-metoden
        setAllImageUrls(urls);
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      }
    };
    fetchAllImageUrls();
  }, []);

  return (
    <Form onSubmit={handelSubmit}>
      <Form.Group controlId='formUserName'>
        <Form.Label>Name</Form.Label>
        <Form.Control
        type="text"
        placeholder="Enter user name"
        value={Name}
        onChange={(e) => setName(e.target.value)}
        required
        pattern="[a-zA-ZæøåÆØÅ. \-]{2,30}"
        title="The Name must be letters and between 2 to 30 characters."
        />
      </Form.Group>

      <Form.Group controlId="formUserImageUrl">
        <Form.Label>Profile Picture</Form.Label>
        <Form.Select
          value={ImageUrl || ''}
          onChange={(e) => setImageUrl(e.target.value)}
          >
            <option value="">Select Url</option>
              {allImageUrls.map((url, index) => (
            <option key={index} value={url}>
              {url}
            </option>
           ))}
          </Form.Select>
      </Form.Group>
       {/* Vis forhåndsvisning av profilbildet hvis en URL er angitt */}
       {ImageUrl && (
        <Form.Group>
          <Form.Label>Preview</Form.Label>
          <div style={{ display: 'flex', justifyContent: 'left' , padding:'0.5rem'}}>
            <Image 
              src={`${API_URL}${ImageUrl}`} 
              roundedCircle 
              width={100} 
              height={100} 
              alt="Profile Picture Preview" 
            />
          </div>
        </Form.Group>
      )}
      <Button variant="primary" type="submit">{isUpdate ? 'Update User' : 'Create User'}</Button>
      <Button variant="secondary" onClick={onCancel} className="ms-2">Cancel</Button>
    </Form>
  );
};

export default UserForm;