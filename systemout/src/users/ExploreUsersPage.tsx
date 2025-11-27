import React, { useState, useEffect } from "react";
import '../index.css';
import {  Button, Form } from 'react-bootstrap';
import { User } from "../types/user";
import { Image } from "../types/image";
import { Note } from "../types/note";
import * as UserService from './UserService';
import * as ImageService from '../images/ImageService';
import * as NoteService from '../notes/NoteService';
import ExploreGrid from "./ExploreGrid";

const ExploreUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading ] = useState<boolean>(false);
  const [error, setError ] = useState<string | null>(null);
  const [showTable, setShowTable] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchUsers = async () =>{
    setLoading(true); // Set loadingto true when starting the fetch
    setError(null); // Clear any previous errors

    try{
      const data = await UserService.fetchUsers();
      setUsers(data);
    } catch(error) {
      console.error(`There was a problem with the fetch operation: ${error.message}`);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false); // Set loading to false once the fetch is complete
    }
  };

  const fetchImages = async () => {
    try {
      const data = await ImageService.fetchImages();
      setImages(data);
    }catch(error) {
      console.error(`There was a problem with the fetch operation: ${error.message}`);
      setError('Failed to fetch images.');
    } 
  };

  const fetchNotes = async () => {
    try {
      const data = await NoteService.fetchNotes();
      setNotes(data);
    }catch(error) {
      console.error(`There was a problem with the fetch operation: ${error.message}`);
      setError('Failed to fetch notes.');
    } 
  };

  useEffect(() => {
    const savedViewMode = localStorage.getItem('userViewMode');
    console.log('[fetch users] Saved view mode:', savedViewMode); // Debugging line
    if (savedViewMode) {
      if (savedViewMode === 'grid')
        setShowTable(false)
      console.log('show table', showTable);
    }
    fetchUsers();
    fetchImages();
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('[save view state] Saving view mode:', showTable ? 'table' : 'grid');
    localStorage.setItem('userViewMode', showTable ? 'table' : 'grid');
  }, [showTable]);

  const filteredUsers = users.filter(user => 
    user.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserDeleted = async (userId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete){
      try {
        await UserService.deleteUser(userId);
        setUsers(prevUsers => prevUsers.filter(user => user.UserId !== userId));
        console.log('User deleted', userId);
      } catch (error){
        console.error('Error deleting user:', error );
        setError('Failed to delete user.');
      }
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '4rem' }}>Explore</h1>
      <Button href='/usercreate' size="lg" variant="outline-success mb-3 me-2" style={{fontWeight:"bold"}}>Create New User</Button>

      <Button onClick={fetchUsers} size="lg" variant="outline-primary mb-3 me-2" disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Users'}
      </Button>
      
      <Form.Group className="mb-3">
        <Form.Control 
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        /> 
      </Form.Group>
      <hr />
      {error && <p style={{ color: 'red'}}>{error}</p>}
      <ExploreGrid users={filteredUsers} images={images} notes={notes}  onUserDeleted={handleUserDeleted} />
      <button className="btn btn-outline-dark" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Back to the top
      </button>
      </div>
  );
};

export default ExploreUsersPage;