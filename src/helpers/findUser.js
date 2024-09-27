import { Invitado, User, Roles } from "../models/index.js";
import { UserNotFountError } from "./errorsInstances.js";

export const findUser = async (email) => {
    try {
        let user = await User.findOne({
            where: { email: email },
            include: [{ model: Roles, as: "roles" }],
        })
        if(!user){
            throw new UserNotFountError(`El usuario con email: ${email}, no existe`)
        }
        return user
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
