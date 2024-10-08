import bcrypt from 'bcrypt'
import { User } from "../../models/index.js";
import { MissingDataError, UserExisting } from "../errorsInstances.js";

export const createNewAdmin = async (nombre, email, password, transaction) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!nombre || !email || !password) {
        throw new MissingDataError('Faltan datos para proceder con el registro')
    }


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
        rol_user_id: 1,
    }, { transaction });

    return newUser
}