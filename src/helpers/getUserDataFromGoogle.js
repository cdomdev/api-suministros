import  axios from 'axios'

export async function getUserDataFromGoogle(token) {
  try {
    // Hacer una solicitud a Google para obtener la información del usuario usando el token de acceso
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Retorna los datos del usuario obtenidos de Google
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener la información del usuario desde Google:",
      error
    );
    throw error;
  }
}

