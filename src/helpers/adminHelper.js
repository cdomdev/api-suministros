import { User } from "../models/index.js";
import bcrypt from 'bcrypt'

export const createNewAdmin = async (nombre, email, password, transaction) => {
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
            rol_user_id: 1,
        }, { transaction });

        return newUser
    } catch (error) {
        throw error
    }
}