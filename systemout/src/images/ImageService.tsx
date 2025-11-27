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

// Get Images
export const fetchImages = async () => {
  const response = await fetch(`${API_URL}/api/imageapi/getimages`);
  return handleResponse(response);
};
// Get Image by Id
export const fetchImageById = async (imageId:string) => {
  const response = await fetch(`${API_URL}/api/imageapi/${imageId}`);
  return handleResponse(response);
};
// Get Image-Urls
export const fetchImageUrls = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/api/imageapi/get-all-image-urls`);
    if (!response.ok) {
      throw new Error(`Failed to fetch image URLs: ${response.statusText}`);
    }
    const data: string[] = await response.json();

    // Modifiser URLene, og sørg for at de ikke får dobbel "/images"
    const formattedUrls = data.map(url => {
      // Sjekk om URLen starter med /wwwroot, og erstatt den med /images
      if (url.startsWith('/wwwroot')) {
        return url.replace(/^\/wwwroot/, '');
      }
      return url; // Retur hvis ikke i ønsket format
    });

    return formattedUrls;
  } catch (error) {
    console.error('Error fetching image URLs:', error);
    throw error; // Kaster feilen videre for å håndtere den der metoden kalles
  }
};

// Post Create Image
export const createImage = async(image:any) => {
  const response = await fetch(`${API_URL}/api/imageapi/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify(image),
  });
  return handleResponse(response);
};
// Put update image
export const updateImage = async (imageId:number, image:any) => {
  const response = await fetch(`${API_URL}/api/imageapi/update/${imageId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(image),
  });
  return handleResponse(response);
};
// Delete image
export const deleteImage = async (imageId:number) => {
  await fetch(`${API_URL}/api/imageapi/delete/${imageId}`, {
    method: 'DELETE',
  });
}; 