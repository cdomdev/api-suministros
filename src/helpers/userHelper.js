import axios from 'axios'
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { User, Roles } from "../models/index.js";
import { sendMailsRegistro } from "../../templates/emailTemplatesJs/sendMailsRegistro.js";
import { InvalidatedPasswordError, UserExisting, UserNotFountError } from './errorsInstances.js'


export const findUser = async (email) => {
    try {
        let user = await User.findOne({
            where: { email: email },
            include: [{ model: Roles, as: "roles" }],
        })
        if (!user) {
            throw new UserNotFountError(`El usuario con email: ${email}, no existe`)
        }
        return user
    } catch (error) {
        throw error;
    }
}


export const getUserDataFromGoogle = async (token) => {
    try {
        const response = await axios.get(
            "https://www.googleapis.com/oauth2/v1/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(
            "Error al obtener la información del usuario desde Google:",
            error
        );
        throw error;
    }
}

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

export const updateDataProfile = async (user, email) => {
    const { name, apellidos, telefono, direccion } = user;
    try {

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
            throw new UserNotFountError('No se pudo actualizar los datos del perfil')
        }

    } catch (error) {
        throw error
    }
};

export const updateDataUser = async (datos) => {
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