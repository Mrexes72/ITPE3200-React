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

// Get Notes
export const fetchNotes = async () => {
  const response = await fetch(`${API_URL}/api/noteapi/getnotes`);
  return handleResponse(response);
};
// Get Note by Id
export const fetchNoteById = async (noteId:string) => {
  const response = await fetch(`${API_URL}/api/noteapi/${noteId}`);
  return handleResponse(response);
};
// Post Create Image
export const createNote = async(note:any) => {
  const response = await fetch(`${API_URL}/api/noteapi/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify(note),
  });
  return handleResponse(response);
};
// Put update image
export const updateNote = async (noteId:number, note:any) => {
  const response = await fetch(`${API_URL}/api/noteapi/update/${noteId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(note),
  });
  return handleResponse(response);
};
// Delete image
export const deleteNote = async (noteId:number) => {
  await fetch(`${API_URL}/api/noteapi/delete/${noteId}`, {
    method: 'DELETE',
  });
}; 