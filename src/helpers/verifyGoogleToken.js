import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

export async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.log("Error en la verificacion del token de google", error);
  }
}
