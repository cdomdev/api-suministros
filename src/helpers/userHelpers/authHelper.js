import axios from 'axios'
import bcrypt from "bcrypt";
import crypto from 'crypto'
import { Op } from "sequelize";
import { promisify } from 'util';
import jwt from 'jsonwebtoken'
import { findUser } from './findUser.js';
import { User, Roles } from "../../models/index.js";
import { sendMailForgotSucess } from '../../../templates/emailTemplatesJs/forgotSucess.js';
import { sendMailsRecover } from '../../../templates/emailTemplatesJs/sendMailsRecoverPassword.js';
import { sendMailsRegistro } from "../../../templates/emailTemplatesJs/sendMailsRegistro.js";
import { UnauthorizedError, MissingDataError, UserExisting, NotFountError, ForbiddenError, } from '../errorsInstances.js'
import { generateAccessToken } from '../../utils/createTokensSesion.js';

const CLIENT_ID = process.env.CLIENT_ID;
const URL_RESET_PASSWORD = process.env.URL_RESET_PASSWORD;


export const getUserDataFromGoogle = async (token) => {

    const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    );

    if (googleResponse.data.audience !== CLIENT_ID) {
        throw new UnauthorizedError('Token de acceso no válido')
    }

    const response = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response) {
        throw new NotFountError('Error al obtener la información del usuario desde Google')
    }

    return response.data;

}

export const findOrCreateUserGoogle = async (datos) => {
    const defaultPassword = process.env.PASSWORD_DEFAULT;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    let user = await findUser(datos.email);

    if (!user) {
        user = await User.create({
            nombre: datos.name,
            email: datos.email,
            password: hashedPassword,
            picture: datos.picture,
            rol_user_id: 2,
        });

        sendMailsRegistro(user.nombre, user.email);
    }

    return user;

};

export const createNewUser = async (nombre, email, password, transaction) => {

    if (!nombre || !email || !password) {
        throw new MissingDataError('Faltan datos para proceder con el registro')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.findOne({
        where: { email: email },
    })

    if (user) {
        throw new UserExisting('Ya existe un usuario registrado con esa informacion')
    }

    const newUser = await User.create({
        nombre: nombre,
        email: email,
        password: hashedPassword,
        rol_user_id: 2,
    }, { transaction });


    sendMailsRegistro(nombre, email);


    return newUser
}

export const findOrUpdateDataUser = async (datos) => {
    let user = await findUser(datos.email)
    if (user) {
        user = await updateDataUser(datos)
    }

    return user
}

export const validatedUser = async (email, password) => {

    if (!email || !password) {
        throw new MissingDataError('Faltan datos para proceder con en inicio de sesion')
    }

    let user = await findUser(email)

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new UnauthorizedError('Contraseña incorrecta')
    }

    return user
}


export const createRequestResetPassword = async (email) => {

    const randomBytesAsync = promisify(crypto.randomBytes);

    if (!email) {
        throw new MissingDataError('Faltan datos para procesar la solicitud')
    }

    let user = await findUser(email);

    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");
    const tokenExpires = Date.now() + 3600000;

    user.resetPasswordToken = token;
    user.resetPasswordExpires = tokenExpires;
    await user.save();

    const resetUrl = `${URL_RESET_PASSWORD}/${token}`;

    const { nombre } = user;

    sendMailsRecover(nombre, email, resetUrl);

    return nombre
}

export const resetDataPassword = async (password, token) => {

    if (!token) {
        throw new MissingDataError("Token no proporcionado");
    }

    let user = await User.findOne({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: { [Op.gt]: Date.now() },
        },
    });

    if (!user) {
        throw new NotFountError('Token inválido o expirado')
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    sendMailForgotSucess(user.name, user.email);

    return user
}

export const updateDataProfile = async (user, email) => {
    const { name, apellidos, telefono, direccion } = user;
    const updatedUser = await User.update(
        { name, apellidos, telefono, direccion },
        { where: { email: email } }
    );

    if (updatedUser[0] === 1) {
        const user = await findUser(email)
        const userSessionData = JSON.stringify({
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono,
            direccion: user.direccion,
            role: newUseuser.rol_name,
            picture: user.picture
        });

        return userSessionData
    } else {
        throw new NotFountError('No se pudo actualizar los datos del perfil')
    }
};

export const updateDataUser = async (datos) => {
    let user = await User.update({
        telefono: datos.telefono,
        direccion: datos.direccion,
        ciudad: datos.city,
        departamento: datos.region,
        detalles: datos.detalles
    }, {
        where: { email: datos.email },
    });

    if (user[0] === 1) {
        let updateUser = findUser(datos.email)
        user = updateUser
    }
    return user
}



export const refreshTokenUser = async (refreshToken, secretRefresToken) => {

    if (!refreshToken) {
        throw new UnauthorizedError('No se proporcionó un refresh token')
    };

    let user = await User.findOne({
        where: { refreshToken: refreshToken },
        include: [
            {
                model: Roles,
                as: "roles",
            },
        ],
    });

    if (!user) {
        throw new NotFountError("El usuario no existe");
    }

    const decoded = jwt.verify(refreshToken, secretRefresToken);

    if (!decoded) {
        throw new ForbiddenError("Refresh token no válido");
    }

    const newAccessToken = generateAccessToken(user);

    return newAccessToken

}