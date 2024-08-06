import { Invitado } from "../models/invitado.js";

//  crear un nuevo usuario con rol de invitado
export const createNewGuest = async (user) => {
  try {
    const guest = await Invitado.create({
      nombre: user.nombre,
      apellidos: user.apellidos,
      direccion: user.direccion,
      telefono: user.telefono,
      email: user.email,
      detalles: user.detalles,
    });
    return guest;
  } catch (error) {
    console.log("Error en la creacion del usuario", error);
    throw error;
  }
};
