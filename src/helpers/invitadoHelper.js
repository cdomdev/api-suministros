import { Invitado } from "../models/invitado.js";
import { findInvited } from "./findUser.js";

export const findOrCreateInvited = async (datos) => {
    try {
        let userDb = await findInvited(datos.email);
        if (userDb) {
            await Invitado.update({
                ciudad: datos.city,
                departamento: datos.region
            }, {
                where: { email: datos.email },
            })
            return userDb;
        } else {
            const NewInvited = await Invitado.create({
                nombre: datos.nombre,
                apellidos: datos.apellido,
                direccion: datos.direccion,
                telefono: datos.telefono,
                email: datos.email,
                detalles: datos.detalles,
                ciudad: datos.city,
                departamento: datos.region
            },);
            return NewInvited;
        }
    } catch (error) {
        throw new Error('Error en la creación o búsqueda del usuario: ' + error.message);
    }
};