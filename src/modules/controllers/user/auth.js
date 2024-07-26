import axios from "axios";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { promisify } from "util";
import { Op } from "sequelize";
import { Roles, User } from "../../models/usersModels.js";
import {
  passwordValidate,
  userExisting,
} from "../../middleware/authValidate.js";
import { getUserDataFromGoogle } from "../../middleware/getUserDataFromGoogle.js";
import { sendMailsRegistro } from "../../../../functions/sendMailsRegistro.js";
import { sendMailsRecover } from "../../../../functions/sendMailsRecoverPassword.js";
import { sendMailForgotSucess } from "../../../../functions/forgotSucess.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../middleware/createToken.js";

const CLIENT_ID = process.env.CLIENT_ID;

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

    // Verifica que el token sea válido
    if (googleResponse.data.audience === CLIENT_ID) {
      // guardar el usuario en base de datos y generar un token JWT
      const userData = await getUserDataFromGoogle(token);

      // Validar existencia de datos en db
      let user = await User.findOne({
        where: { email: userData.email },
        include: [{ model: Roles, as: "roles" }],
      });

      if (!user) {
        // Verificar si el rol de usuario ya existe
        let roleUser = await Roles.findOne({ where: { rol_name: "user" } });

        if (!roleUser) {
          roleUser = await Roles.create({
            rol_name: "user",
          });
        }
        // const hashedPasswordInvited = await bcrypt.hash(defaultPassword, 10);

        user = await User.create({
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
          password: defaultPassword,
          rol_user_id: roleUser.id,
        });
        sendMailsRegistro(userData.name, userData.email);
      }

      // crear tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      user.refreshToken = refreshToken;
      await user.save();
      res
        .status(200)
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 1000 * 60 * 60, // 1hora
        })
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
        })
        .json({
          success: true,
          message: `Inicio de sesión exitoso`,
          id: user.id,
          name: user.name,
          picture: user.picture,
          email: user.email,
          telefono: user.telefono,
          direccion: user.direccion,
          accessToken: accessToken,
          role: user.roles.rol_name,
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

  let clienName = name;
  let clienEmail = email;

  try {
    if (!clienName || !clienEmail || !password) {
      res
        .status(400)
        .json({ message: "falatn datos para proceder con el registro" });
    }

    const existingUser = await userExisting(email);

    if (existingUser) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // crear usuario y asignar rol
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      rol_user_id: 2,
    });

    sendMailsRegistro(newUser.name, newUser.email);

    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      picture: newUser.picture,
      rol_user_id: newUser.rolUserId,
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
        const { rol_user_id, email, name, telefono, direccion, id } =
          userFromDB;

        const accessToken = generateAccessToken(userFromDB);
        const refreshToken = generateRefreshToken(userFromDB);

        userFromDB.refreshToken = refreshToken;
        await userFromDB.save();

        res
          .status(200)
          .cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60, // 1hora
          })
          .cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
          })
          .json({
            success: true,
            message: `Inicio de sesión exitoso ${userFromDB.roles.rol_name}`,
            name: name,
            id: id,
            rol_user_id: rol_user_id,
            email: email,
            telefono: telefono,
            direccion: direccion,
            accessToken: accessToken,
            role: userFromDB.roles.rol_name,
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

export const prueba = async (req, res) => {
  try {
    let users = await User.findAll({
      include: [{ model: Roles, as: "roles" }],
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users with roles: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
