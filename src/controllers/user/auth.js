import { conecction } from "../../../database/conecction.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/createTokensSesion.js";
import { createNewUser, findOrCreateUserGoogle, resetDataPassword, validatedUser, getUserDataFromGoogle, createRequestResetPassword } from "../../helpers/userHelpers/authHelper.js";
import { ErrorServer, MissingDataError, NotFountError, UnauthorizedError, UserExisting } from "../../helpers/errorsInstances.js";


export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {

    const userData = await getUserDataFromGoogle(token);

    const nuevoUser = await findOrCreateUserGoogle(userData)

    const accessToken = generateAccessToken(nuevoUser);

    const refreshToken = generateRefreshToken(nuevoUser);

    const userSessionData = JSON.stringify({
      id: nuevoUser.id,
      nombre: nuevoUser.nombre,
      email: nuevoUser.email,
      telefono: nuevoUser.telefono,
      direccion: nuevoUser.direccion,
      role: nuevoUser.roles.rol_name,
      picture: nuevoUser.picture
    });

    nuevoUser.refreshToken = refreshToken;
    await nuevoUser.save();

    res
      .status(200)
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .cookie("user_sesion", userSessionData, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .json({
        success: true,
        message: `OK`,
        id: nuevoUser.id,
        nombre: nuevoUser.nombre,
        email: nuevoUser.email,
        telefono: nuevoUser.telefono,
        direccion: nuevoUser.direccion,
        role: nuevoUser.roles.rol_name,
        picture: nuevoUser.picture
      });
  } catch (error) {
    console.error('Error en el proceso de inicio de sesión con Google:', error);
    if (error instanceof UnauthorizedError) {
      return res.status(error.statusCode).json({ message: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message })
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};

export const registroController = async (req, res) => {
  const { nombre, email, password } = req.body;
  const t = await conecction.transaction();

  try {

    await createNewUser(nombre, email, password, t);

    await t.commit();

    res.status(201).json({ message: 'success' });

  } catch (error) {
    await t.rollback();
    console.log('Error en el proceso de resgitro de un nuevo usuario', error)
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof UserExisting) {
      return res.status(error.statusCode).json({ message: 'Ya existe un usuario con esa informacion' });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body

  try {

    const user = await validatedUser(email, password)

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    const userSessionData = JSON.stringify({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
      direccion: user.direccion,
      role: user.roles.rol_name,
      picture: user.picture
    });

    res
      .status(200)
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .cookie("user_sesion", userSessionData, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .json({
        success: true,
        message: `OK`,
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        direccion: user.direccion,
        role: user.roles.rol_name,
        picture: user.picture
      });
  } catch (error) {
    console.log('Hubo un error en la autenticacion del usuario', error)
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof UnauthorizedError) {
      return res.status(error.statusCode).json({ message: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message })
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};


export const validateEmail = async (req, res) => {
  const { email } = req.body;

  try {

    const user = await createRequestResetPassword(email)

    return res.status(200).json({
      message: 'success',
      email,
      user,
    });

  } catch (error) {
    console.log("Error al intentar restablcer la contraseña:", error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};


export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params
  try {

    await resetDataPassword(password, token)

    res
      .status(200)
      .json({ message: "Contraseña restablecida con éxito" });

  } catch (error) {
    console.log("Error en el controlador de inicio de sesión:", error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};


export const logout = (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("access_token", { path: '/' })
      .clearCookie("refresh_token", { path: '/' })
      .clearCookie("user_sesion", { path: '/' })
      .json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error during logout ", error);
    return res.status(500).json({ error: new ErrorServer().message });
  }
};
