import { Roles, User } from "../models/index.js";

// Función para verificar si un usuario existe
export async function userExisting(email) {
  try {
    return User.findOne({
      where: { email: email },
      include: [{ model: Roles, as: "roles" }],
    });
  } catch (error) {
    console.log("Error al valuidar la exitencia de un usuario", error);
  }
}
