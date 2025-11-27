import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import * as UserService from '../users/UserService';
import { User } from '../types/user';
import { Note } from '../types/note';

interface NoteFormProps {
  onNoteChanged: (newNote: Note) => void;
  NoteId?: number;
  isUpdate?: boolean;
  initialData?: Note;
}

const NoteForm: React.FC<NoteFormProps> = ({
  onNoteChanged,
  NoteId,
  isUpdate = false,
  initialData}) => {
    const [Title, setTitle] = useState<string>(initialData?.Title || '');
    const [Body, setBody] = useState<string>(initialData?.Body || '');
    const [UserId, setUserId] = useState<number>(initialData?.UserId || null);
    const [users, setUsers] = useState<User[]>([]);
    const [titleError, setTitleError] = useState<string | null>(null);
    const [bodyError, setBodyError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onCancel = () => {
      navigate(-1);
    }

    const handelSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      const note: Note = {NoteId, Title, Body, UserId};
      onNoteChanged(note);
    }

    const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length > 800) {
        setBodyError("The Description can't be longer than 800 characters");
      } else {
        setBodyError(null); // Fjern feilmeldingen hvis den er gyldig
      }
      setBody(value);
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
      // Hent alle brukere når komponenten lastes inn
      const fetchUsers = async () => {
        try {
          const userData = await UserService.fetchUsers();
          setUsers(userData);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
      fetchUsers();
    }, []);

    return (
      <Form onSubmit={handelSubmit}>
        <Form.Group controlId='formNoteTitle'>
          <Form.Label>Title</Form.Label>
          <Form.Control
          type="text"
          placeholder="Enter Note Title"
          value={Title}
          onChange={handleTitleChange}
          required
          isInvalid={!!titleError} // Bruker spesifikk feilmelding
          />
          <Form.Control.Feedback type="invalid">{titleError}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formImageDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
          as="textarea"
          rows={4}
          placeholder="Enter Note body"
          required
          value={Body}
          onChange={handleBodyChange}
          isInvalid={!!bodyError} 
          />
          <Form.Control.Feedback type="invalid">{bodyError}</Form.Control.Feedback>
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
        <div style={{ paddingTop: "15px" }}>
        <Button variant="primary" type="submit" disabled={!!titleError || !!bodyError}>{isUpdate ? 'Update Note' : 'Create Note'}</Button>
        <Button variant="secondary" onClick={onCancel} className="ms-2">Cancel</Button>
        </div>
      </Form>
  );
};

export default NoteForm;
