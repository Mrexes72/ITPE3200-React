import React from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import { User } from "../types/user";
import * as UserService from './UserService';


const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();// Create a navigate function

  const handleUserCreated = async (user: User) => {
    try {
      const data = await UserService.createUser(user);
      console.log('User created successfully', data);
      navigate('/explore'); // Navigate back after successful
    } catch(error) {
      console.error('There was a problem with the fetch operation:',error);
    }
  }

  return (
    <div>
      <h2>Create New User</h2>
      <UserForm onUserChanged={handleUserCreated}/>
    </div>
  );
};

export default UserCreatePage;