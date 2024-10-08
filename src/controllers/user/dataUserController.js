import { updateDataProfile } from '../../helpers/userHelpers/authHelper.js'
import { MissingDataError, ErrorServer, NotFountError } from "../../helpers/errorsInstances.js";
import { findUser } from '../../helpers/userHelpers/findUser.js';


export const obtenerDatosUsuario = async (req, res) => {
  const { email } = req.query;

  try {

    if (!email) {
      throw new MissingDataError('Email no proporcionado')
    }

    const dataUser = await findUser(email)

    const { nombre, picture } = dataUser[0];

    res.status(200).json({ nombre, picture });

  } catch (error) {
    console.log('Error al obtener los datos del usuario', error)
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error("Error al obtener los datos del usuario", error);
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};

export const actulizarDatosDeUsuario = async (req, res) => {
  const { email, dataUpdate } = req.body;

  try {

    if (!email || !dataUpdate) {
      throw new MissingDataError('Faltan datos para actualizar el perfil')
    }

    const updatedUser = await updateDataProfile(dataUpdate, email);

    return res
      .status(201)
      .cookie("user_sesion", updatedUser, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .json({
        success: true,
        message: `OK`,
      });

  } catch (error) {
    console.log('Error al intentar actulizar los datos del usuario', error)
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error("Error al actulizar los datos del usuario:", error);
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};
