import API_URL from "../apiConfig";

const headers = {
  'Content-Type': 'application/json',
};

const handleResponse = async (response: Response) => {
  if(response.ok){
    if(response.status === 204){
      return null;
    }
    return response.json();
  } else {
    const errorText = await response.text();
    throw new Error(errorText || 'Network response was not ok');
  }
};

// Get Users
export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/api/userapi/userlist`);
  return handleResponse(response);
};
// Get User by Id
export const fetchUsersById = async (userId:string) => {
  const response = await fetch(`${API_URL}/api/userapi/${userId}`);
  return handleResponse(response);
};
// Post Create User
export const createUser = async (user:any) => {
  const response = await fetch(`${API_URL}/api/userapi/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify(user),
  });
  return handleResponse(response);
};
// Put update user
export const updateUser = async (userId:number, user:any) => {
  const response = await fetch(`${API_URL}/api/userapi/update/${userId}`,{
      method: 'PUT',
      headers,
      body: JSON.stringify(user),
    });
    return handleResponse(response);
};
// Delete user
export const deleteUser = async (userId:number) => {
  await fetch(`${API_URL}/api/userapi/delete/${userId}`, {
    method: 'DELETE',
  });
};