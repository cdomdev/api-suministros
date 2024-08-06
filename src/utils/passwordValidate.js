import bcrypt from "bcrypt";

// Función para verificar si la contraseña coincide
export async function passwordValidate(inputPassword, storedPassword) {
  return bcrypt.compare(inputPassword, storedPassword);
}
