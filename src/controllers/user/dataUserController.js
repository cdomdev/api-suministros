import { userExisting } from "../../helpers/validateUserExisting.js";
import { updateDataProfile } from "../../helpers/updateDataUser.js";
import { User } from "../../models/index.js";

export const obtenerDatosUsuario = async (req, res) => {
  const { email } = req.query;

  try {
    const dataUser = await User.findAll({ where: { email } });

    if (!dataUser || dataUser.length === 0) {
      return res.status(400).json({ message: "No existen datos del usuario" });
    }

    const { name, picture } = dataUser[0];
    res.status(200).json({ name, picture });
  } catch (error) {
    console.log("Error interno del servidor", error);
    res.status(500).json({ message: "Error interno en el servidor" });
  }
};

// acontrolador para actulziar datos del usuario

export const actulizarDatosDeUsuario = async (req, res) => {
  const { email, dataUpdate } = req.body;
  try {
    const existingUser = await userExisting(email);

    if (!existingUser) {
      return res.status(400).json({ message: "El usuario no existe" });
    }

    const updatedUser = await updateDataProfile(dataUpdate, email);

    // Verificar si la actualización fue exitosa
    if (updatedUser[0] === 1) {
      const newUser = await User.findOne({ where: { email: email } });
      const userSessionData = JSON.stringify({
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        telefono: newUser.telefono,
        direccion: newUser.direccion,
        role: newUser.roles.rol_name,
        picture: newUser.picture
      });
      return res
        .status(200)
        .cookie("user_sesion", userSessionData, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 1000 * 60 * 60 * 24 * 7
        })
        .json({
          success: true,
          message: `OK`,
        });


    } else {
      // No se pudo actualizar el usuario
      return res
        .status(500)
        .json({ message: "No se pudo actualizar el usuario" });
    }
  } catch (error) {
    console.log("Error en la actualización de datos", error);
    res.status(500).json({ message: "Error en la actualización de datos" });
  }
};
