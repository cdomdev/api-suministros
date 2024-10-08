import { User, Roles } from "../../models/index.js"
import { NotFountError } from "../errorsInstances.js"

export const findUser = async (email) => {

    let user = await User.findOne({
        where: { email: email },
        include: [{ model: Roles, as: "roles" }],
    })
    if (!user) {
        throw new NotFountError(`El usuario con email: ${email}, no existe`)
    }
    return user
}