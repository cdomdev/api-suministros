import { Invitado, User, Roles } from "../models/index.js";

export const findUser = async (email) => {
    try {
        return await User.findOne({
            where: { email: email },
            include: [{ model: Roles, as: "roles" }],
        })
    } catch (error) {
        throw new Error('Error en la búsqueda del usuario' + error.message);
    }
}

export const findInvited = async (email) => {
    try {
        return await Invitado.findOne({
            where: { email: email },
        })
    } catch (error) {
        throw new Error('Error en la búsqueda del usuario' + error.message);
    }
}
