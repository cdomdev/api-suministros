import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import { findUser } from "./findUser.js";
import { sendMailsRegistro } from "../../templates/emailTemplatesJs/sendMailsRegistro.js";

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
        console.error("Error en el proceso de creación o búsqueda del usuario:", error.message);
        throw new Error('Error en la creación de un nuevo usuario');
    }
};


export const createNewUser = async (email, nombre, password, transaction) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        let user = await findUser(email)
        if (!user) {
            const newUser = await User.create({
                nombre: nombre,
                email: email,
                password: hashedPassword,
                rol_user_id: 2,
            }, { transaction });
            return newUser
        }
        return user
    } catch (error) {
        throw new Error('Error en la creacion de un nuevo usuario', error.message)
    }
}


export const finOrUpdateDataUser = async (datos, transaction) => {
    try {
        let user = await findUser(datos.email)
        if (user) {
            user = await updateDataUser(datos)
        }
        return user
    } catch (error) {
        throw new Error('Error en la creacion de un nuevo usuario', error.message)
    }
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
        throw new Error('Error en la creacion de un nuevo usuario', error.message)
    }
}

