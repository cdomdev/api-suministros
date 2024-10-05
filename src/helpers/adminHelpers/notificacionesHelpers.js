import { Notifcaciones } from "../../models/index.js";
import { NotFountError, MissingDataError } from '../../helpers/errorsInstances.js'

export const getAllNotificaciones = async () => {
    try {

        const notifications = await Notifcaciones.findAll({
            where: {
                leido: false
            }
        });

        return notifications;
    } catch (error) {
        throw error
    }
};



export const updateStateNotificaciones = async (id) => {
    try {

        if (!id) throw new MissingDataError('Se requiere de una id para actulizar el estado de la notificacion')


        const [updateRead] = await Notifcaciones.update(
            { leido: true },
            { where: { id } }
        );

        if (updateRead === 0) {
            throw new NotFountError('Notificación no encontrada')
        }

    } catch (error) {
        throw error
    }

}

export const allRead = async () => {
    try {
        // Actualiza todas las notificaciones marcándolas como leídas
        const result = await Notifcaciones.update(
            { leido: true },
            {
                where: { leido: false },
            }
        );

        return result;
    } catch (error) {
        throw error;
    }
};

export const deleteNotification = async (id) => {
    try {
        if (!id) throw new MissingDataError('Se requiere de una id para eliminar una notificacion')

        const deletedCount = await Notifcaciones.destroy({
            where: { id },
        });

        if (deletedCount === 0) {
            throw new NotFountError('No se pudo eliminar la notificacion')
        }

        const notificaciones = await getAllNotificaciones();

        return notificaciones
    } catch (error) {
        throw error
    }
}

