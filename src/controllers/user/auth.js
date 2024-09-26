import axios from "axios";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { promisify } from "util";
import { Op } from "sequelize";
import { Roles, User } from "../../models/index.js";
import { userExisting } from "../../helpers/validateUserExisting.js";
import { passwordValidate } from "../../utils/passwordValidate.js";
import { getUserDataFromGoogle } from "../../helpers/getUserDataFromGoogle.js";
import {
  sendMailsRegistro,
  sendMailsRecover,
  sendMailForgotSucess,
} from "../../../templates/emailTemplatesJs/index.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/createTokensSesion.js";
import { createNewUser, findOrCreateUserGoogle } from "../../helpers/userHelper.js";

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
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const registroController = async (req, res) => {
  const { nombre, email, password } = req.body;
  let clienEmail = email;
  try {
    if (!nombre || !clienEmail || !password) {
      res
        .status(400)
        .json({ message: "faltan datos para proceder con el registro" });
    }

    await createNewUser(email);

    res.status(201).json({ message: 'success' });

  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ error: "Error en el registro" });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email y contraseña son requeridos",
    });
  }

  try {
    const userFromDB = await userExisting(email);

    if (!userFromDB) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const passwordMatch = await passwordValidate(password, userFromDB.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }

    const accessToken = generateAccessToken(userFromDB);
    const refreshToken = generateRefreshToken(userFromDB);

    userFromDB.refreshToken = refreshToken;
    await userFromDB.save();
    const userSessionData = JSON.stringify({
      id: userFromDB.id,
      nombre: userFromDB.nombre,
      email: userFromDB.email,
      telefono: userFromDB.telefono,
      direccion: userFromDB.direccion,
      role: userFromDB.roles.rol_name,
      picture: userFromDB.picture
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
        id: userFromDB.id,
        nombre: userFromDB.nombre,
        email: userFromDB.email,
        telefono: userFromDB.telefono,
        direccion: userFromDB.direccion,
        role: userFromDB.roles.rol_name,
        picture: userFromDB.picture
      });
  } catch (error) {
    console.error("Error en el controlador de inicio de sesión:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor. Por favor intente de nuevo más tarde.",
    });
  }
};


const randomBytesAsync = promisify(crypto.randomBytes);

export const validateEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar si el usuario existe
    const user = await userExisting(email);

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Buscar el usuario en la base de datos
    const userData = await User.findOne({ where: { email } });

    if (!userData) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Generar token
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");
    // 1 hora desde ahora
    const tokenExpires = Date.now() + 3600000;

    // Guardar token y fecha de expiración en el usuario
    userData.resetPasswordToken = token;
    userData.resetPasswordExpires = tokenExpires;
    await userData.save();

    const resetUrl = `http://localhost:4321/restablecer-contrasenia/${token}`;

    const { nombre } = userData;

    sendMailsRecover(nombre, email, resetUrl);

    return res.status(200).json({
      email,
      nombre,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el proceso", error });
  }
};

// controlador para restablecer contraseñas
export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params


  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    sendMailForgotSucess(user.name, user.email);
    const { name } = user;
    res
      .status(200)
      .json({ message: "Contraseña restablecida con éxito", name: name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el proceso", error });
  }
};


export const logout = (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("access_token", { path: '/' })
      .clearCookie("refresh_token", { path: '/' })
      .json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error during logout ", error);
    res.status(500).json({ message: "Logout failed" });
  }
};
