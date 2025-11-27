import React, {useState, useEffect} from 'react';
import { Form, Button } from 'react-bootstrap';
import { Comment } from '../types/comment';
import * as UserService from '../users/UserService';
import { User } from '../types/user';

interface CommentFormProps {
  onCommentChanged: (newComment: Comment) => void;
  CommentId?: number;
  NoteId?: number;
  ImageId?: number;
  isUpdate?: boolean;
  initialData?: Comment;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onCommentChanged,
  CommentId,
  NoteId,
  ImageId,
  isUpdate = false,
  initialData}) => {
    const [Body, setBody] = useState<string>(initialData?.Body || '');
    const [UserId, setUserId] = useState<number>(initialData?.UserId || null);
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handelSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      const comment: Comment = {CommentId, Body, UserId, ImageId, NoteId};
      onCommentChanged(comment);
    }

    const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length > 800) {
        setError("The Description can't be longer than 800 characters");
      } else {
        setError(null); // Fjern feilmeldingen hvis den er gyldig
      }
      setBody(value);
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
        <Form.Group controlId="formCommentBody">
          <Form.Label>Body</Form.Label>
          <Form.Control
          as="textarea"
          rows={4}
          placeholder="Enter Comment body"
          value={Body}
          required
          onChange={handleBodyChange}
          isInvalid={!!error}
          />
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
          <Button variant="primary" type="submit" disabled={!!error}>
            {isUpdate ? 'Update Comment' : 'Create Comment'}</Button>
        </div>
      </Form>
  );
};

export default CommentForm;