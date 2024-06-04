import  { userExisting } from "../../middleware/authValidate.js";
import  { User } from "../../models/usersModels.js";

// controladore para listar- obtener datos del usuario

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
      // Validar la existencia del usuario en la base de datos
      const existingUser = await userExisting(email);
  
      if (!existingUser) {
        return res.status(400).json({ message: "El usuario no existe" });
      }
  
      // Actualizar los datos del usuario
      const { name, apellidos, telefono, direccion } = dataUpdate;
  
      const updatedUser = await User.update(
        { name, apellidos, telefono, direccion },
        { where: { email: email } }
      );
  
      // Verificar si la actualización fue exitosa
      if (updatedUser[0] === 1) {
        // La actualización fue exitosa
        // Obtener los nuevos datos del usuario actualizado
        const newUser = await User.findOne({ where: { email: email } });
        const {
          name,
          role,
          telefono,
          email: userEmail,
          token,
          direccion,
          picture,
        } = newUser;
        return res.status(200).json({
          message: "Datos actualizados correctamente",
          name: name,
          role: role,
          token: token,
          email: userEmail,
          telefono: telefono,
          direccion: direccion,
          picture: picture,
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


  