import { Invitado } from "../models/invitado.js";

export const findInvited = async (email) => {
    try {
        return await Invitado.findOne({
            where: { email: email },
        })
    } catch (error) {
        throw error;
    }
}


export const findOrCreateInvited = async (datos) => {

    console.log('datos para el invitado ---> ', datos)

    try {
        let userDb = await findInvited(datos.email);
        if (!userDb) {
            await Invitado.create({
                nombre: datos.nombre,
                apellidos: datos.apellido,
                direccion: datos.direccion,
                telefono: datos.telefono,
                email: datos.email,
                detalles: datos.detalles,
                ciudad: datos.city,
                departamento: datos.region
            },);

            let invited = await findInvited(datos.email)
            console.log('usuario incitado', invited)
            return invited;
        } else {
            await Invitado.update({
                ciudad: datos.city,
                departamento: datos.region
            }, {
                where: { email: datos.email },
            })

            let invited = await findInvited(datos.email)
            console.log('usuario incitado', invited)
            return invited;
        }


    } catch (error) {
        throw error
    }
};