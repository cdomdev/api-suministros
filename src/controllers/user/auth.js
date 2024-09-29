import axios from "axios";
import crypto from "crypto";
import { promisify } from "util";
import { getUserDataFromGoogle } from "../../helpers/getUserDataFromGoogle.js";
import { conecction } from "../../../database/conecction.js";
import {
  sendMailsRegistro,
  sendMailsRecover,
  sendMailForgotSucess,
} from "../../../templates/emailTemplatesJs/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../helpers/createTokensSesion.js";
import { createNewUser, findOrCreateUserGoogle, resetDataPassword, validatedUser } from "../../helpers/userHelper.js";
import { ErrorServer, InvalidatedPasswordError, MissingDataError, UserExisting, UserNotFountError } from "../../helpers/errorsInstances.js";
import { findUser } from "../../helpers/findUser.js";
const randomBytesAsync = promisify(crypto.randomBytes);



export const googleLogin = async (req, res) => {
  const { token } = req.body;
  const CLIENT_ID = process.env.CLIENT_ID;

  try {
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    );

    if (googleResponse.data.audience !== CLIENT_ID) {
      return res.status(401).json({ error: 'Token de acceso no válido' });
    }

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
    return res.status(500).json({ error: new ErrorServer().message });
  }
};

export const registroController = async (req, res) => {
  const { nombre, email, password } = req.body;
  const t = await conecction.transaction();

  try {

    if (!nombre || !email || !password) {
      throw new MissingDataError('Faltan datos para proceder con el registro')
    }

    await createNewUser(nombre, email, password, t);

    await t.commit();

    sendMailsRegistro(nombre, email);

    res.status(201).json({ message: 'success' });

  } catch (error) {
    await t.rollback();
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof UserExisting) {
      return res.status(error.statusCode).json({ message: 'Ya existe un usuario con esa informacion' });
    } else {
      console.error("Error en el registro de un nuevo usuario:", error);
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new MissingDataError('Faltan datos para proceder con en inicio de sesion')
  }

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
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof UserNotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof InvalidatedPasswordError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error("Error en el controlador de inicio de sesión:", error);
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};

export const validateEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new MissingDataError('Faltan datos para procesar la solicitud')
  }
  try {

    let user = await findUser(email);

    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");
    const tokenExpires = Date.now() + 3600000;

    user.resetPasswordToken = token;
    user.resetPasswordExpires = tokenExpires;
    await user.save();

    const resetUrl = `http://localhost:4321/restablecer-contrasenia/${token}`;

    const { nombre } = user;

    sendMailsRecover(nombre, email, resetUrl);

    return res.status(200).json({
      message: 'success',
      email,
      nombre,
    });

  } catch (error) {
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof UserNotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error("Error al intentar restablcer la contraseña:", error);
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};


export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params

  if (!token) {
    throw new MissingDataError("Token no proporcionado");
  }
  try {

    let user = resetDataPassword(password, token)
    sendMailForgotSucess(user.name, user.email);
    res
      .status(200)
      .json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof UserNotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error("Error en el controlador de inicio de sesión:", error);
      return res.status(500).json({ error: new ErrorServer().message });
    }
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
