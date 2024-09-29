import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { findUser } from "./findUser.js";
import { sendMailsRegistro } from "../../templates/emailTemplatesJs/sendMailsRegistro.js";
import { InvalidatedPasswordError, UserExisting, UserNotFountError } from './errorsInstances.js'

export const findOrCreateUserGoogle = async (datos) => {
    const defaultPassword = process.env.PASSWORD_DEFAULT;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    try {

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

    } catch (error) {
        throw error
    }
};

export const createNewUser = async (nombre, email, password, transaction) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {

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

        return newUser
    } catch (error) {
        throw error
    }
}

export const findOrUpdateDataUser = async (datos) => {
    try {
        let user = await findUser(datos.email)
        if (user) {
            user = await updateDataUser(datos)
        }

        return user
    } catch (error) {
        throw error
    }
}

export const validatedUser = async (email, password) => {

    let user = await findUser(email)

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new InvalidatedPasswordError('Contraseña incorrecta')
    }

    return user
}


const updateDataUser = async (datos) => {
    try {
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

    } catch (error) {
        throw error
    }
}

export const resetDataPassword = async (password, token) => {
    try {
        let user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() },
            },
        });

        if (!user) {
            throw new UserNotFountError('Token inválido o expirado')
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return user
    } catch (error) {
        throw error
    }
}