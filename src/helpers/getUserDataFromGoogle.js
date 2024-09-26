import axios from 'axios'

export async function getUserDataFromGoogle(token) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener la información del usuario desde Google:",
      error
    );
    throw error;
  }
}

