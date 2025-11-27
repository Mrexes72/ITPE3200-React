import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "./UserForm";
import { User } from '../types/user';
import * as UserService from './UserService';

const UserUpdatePage: React.FC = () => {
  const { userId } = useParams<{ userId: string}>();// Get UserId from the URL
  const navigate = useNavigate(); // Create a navigate function
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await UserService.fetchUsersById(userId);
        setUser(data);
      } catch (error){
        setError('Failed to fetch user');
        console.error('There was a problem with the fetch opetaion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleUserUpdated = async (user: User) => {
    try {
      const data = await UserService.updateUser(user.UserId, user);
      console.log('User update was successfully:', data);
      navigate('/explore');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if(!user) return <p>No User Found</p>

  return (
    <div>
      <h2>Update User</h2>
      <UserForm onUserChanged={handleUserUpdated} UserId={user.UserId} isUpdate={true} initialData={user} />
    </div>
  )
};

export default UserUpdatePage;