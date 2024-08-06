import { User } from "../models/user.js";

export const updateDataUser = async (user) => {
  try {
    if (user.telefono || user.direccion || user.detalles) {
      await User.update(
        {
          telefono: user.telefono,
          direccion: user.direccion,
          detalles: user.detalles,
        },
        { where: { email: user.email } }
      );
    }
  } catch (error) {
    console.log("Hubo un error al actualizar datos del usuario", error);
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
    console.log("Error al actualizar los datos del pertil", error);
  }
};
