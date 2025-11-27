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

// Get Comments
export const fetchComments = async () => {
  const response = await fetch(`${API_URL}/api/commentapi/getcomments`);
  return handleResponse(response);
};
// Get Comment by Id
export const fetchCommentById = async (commentId:string) => {
  const response = await fetch(`${API_URL}/api/commentapi/${commentId}`);
  return handleResponse(response);
};
// Post Create Comment
export const createComment = async(comment:any) => {
  const response = await fetch(`${API_URL}/api/commentapi/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify(comment),
  });
  return handleResponse(response);
};
// Put update Comment
export const updateComment = async (commentId:number, comment:any) => {
  const response = await fetch(`${API_URL}/api/commentapi/update/${commentId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(comment),
  });
  return handleResponse(response);
};
// Delete Comment
export const deleteComment = async (commentId:number) => {
  await fetch(`${API_URL}/api/commentapi/delete/${commentId}`, {
    method: 'DELETE',
  });
}; 