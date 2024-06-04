import axios from "axios";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { promisify } from "util";
import { Op } from "sequelize";
import { User } from "../../models/usersModels.js";
import {
  passwordValidate,
  userExisting,
} from "../../middleware/authValidate.js";
import { getUserDataFromGoogle } from "../../middleware/getUserDataFromGoogle.js";
import { sendMailsRegistro } from "../../../../functions/sendMailsRegistro.js";
import { sendMailsRecover } from "../../../../functions/sendMailsRecoverPassword.js";
import { sendMailForgotSucess } from "../../../../functions/forgotSucess.js";

const claveSecreta = process.env.CLAVE_SECRETA;
const CLIENT_ID = process.env.CLIENT_ID;
const tiempoExpiracion = 3600;

// modulo de promisify para creacion del token
const randomBytesAsync = promisify(crypto.randomBytes);

// inciio con google
export const googleLogin = async (req, res) => {
  const { token } = req.body;
  const defaultPassword = process.env.PASSWORD_DEFAULT;
  try {
    // Verificar el token de acceso con Google
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    );

    // Verifica que el token sea válido y que pertenezca a tu cliente de Google
    if (googleResponse.data.audience === CLIENT_ID) {
      // Por ejemplo, puedes guardar el usuario en tu base de datos y generar un token JWT
      const userData = await getUserDataFromGoogle(token);

      // validar existencia de datos en db
      let user = await User.findOne({
        where: { email: userData.email },
      });

      if (!user) {
        user = await User.create({
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
          password: defaultPassword,
          role: "user",
        });
        sendMailsRegistro(userData.name, userData.email);
      }

      return res.status(200).json({
        message: "Inicio de sesion exitoso",
        token,
        id: user.id,
        role: user.role,
        name: user.name,
        picture: user.picture,
        email: user.email,
        telefono: user.telefono,
        direccion: user.direccion,
      });
    } else {
      // El token no es válido para tu cliente de Google
      res.status(401).json({ error: "Token de acceso no válido" });
    }
  } catch (error) {
    console.error("Error al verificar el token de acceso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// constrolador para el resgitro de usaurios

export const registroController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await userExisting(email);
    if (existingUser) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    sendMailsRegistro(newUser.name, newUser.email);

    const token = jwt.sign({ user: newUser }, claveSecreta, {
      expiresIn: 3600,
    });
    return res.status(201).json({
      message: "Registro exitoso",
      token,
      id: newUser.id,
      role: newUser.role,
      name: newUser.name,
      picture: newUser.picture,
      email: newUser.email,
      direccion: newUser.direccion,
      telefono: newUser.telefono,
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    return res.status(500).json({ error: "Error en el registro" });
  }
};

// constrolador para el login de usuarios

export const loginController = async (req, res) => {
  const { email1, password } = req.body;

  try {
    const userFromDB = await userExisting(email1);

    if (userFromDB) {
      const passwordMatch = await passwordValidate(
        password,
        userFromDB.password
      );
      if (passwordMatch) {
        const { role, email, name, telefono, direccion, id } = userFromDB;

        const token = jwt.sign(
          { userId: id, email, role, name },
          claveSecreta,
          {
            expiresIn: tiempoExpiracion,
          }
        );
        res.status(200).json({
          success: true,
          message: `Inicio de sesión exitoso (${role})`,
          name: name,
          id: id,
          role: role,
          token: token,
          email: email,
          telefono: telefono,
          direccion: direccion,
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Contraseña incorrecta" });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error en el controlador de inicio de sesión:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

// controlador para validar email y restablcer contraseña
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

    const resetUrl = `http://localhost:5173/suministros/reset-password/${token}`;

    const { name } = userData;

    sendMailsRecover(name, email, resetUrl);

    return res.status(200).json({
      email: email,
      name: name,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el proceso", error });
  }
};

// controlador para restablecer contraseñas
export const resetPassword = async (req, res) => {
  const { values, token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token no proporcionado" });
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

    const hashedPassword = await bcrypt.hash(values.password, 12);
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
