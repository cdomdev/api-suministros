import { User } from "../models/user.js";

export const updateDataUser = async (datos) => {
  try {
    if (datos.telefono || datos.direccion || datos.detalles) {
      await User.update(
        {
          telefono: datos.telefono,
          direccion: datos.direccion,
          detalles: datos.detalles,
        },
        { where: { email: datos.email } }
      );
    }
  } catch (error) {
    throw new Error('Hubo un error al actualizar datos del usuario')
  }
};

export const updateDataProfile = async (user, email) => {
  const { name, apellidos, telefono, direccion } = user;
  try {
    const updatedUser = await User.update(
      { name, apellidos, telefono, direccion },
      { where: { email: email } }
    );
    return updatedUser;
  } catch (error) {
    throw new Error('Error al actualizar los datos del pertil')
  }
};
