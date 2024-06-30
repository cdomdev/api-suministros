import bcrypt from "bcrypt";
import { User } from "../models/usersModels.js";
import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// Función para verificar si un usuario existe
export async function userExisting(email) {
  return User.findOne({
    where: { email: email },
  });
}

// Función para verificar si la contraseña coincide
export async function passwordValidate(inputPassword, storedPassword) {
  return bcrypt.compare(inputPassword, storedPassword);
}

export async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}
