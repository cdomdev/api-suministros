import { Notifcaciones } from "../../models/index.js";
import { NotFountError, MissingDataError } from '../../helpers/errorsInstances.js'

export const getAllNotificaciones = async () => {

    const notifications = await Notifcaciones.findAll({
        where: {
            leido: false
        }
    });

    return notifications;
};



export const updateStateNotificaciones = async (id) => {

    if (!id) throw new MissingDataError('Se requiere de una id para actulizar el estado de la notificacion')


    const [updateRead] = await Notifcaciones.update(
        { leido: true },
        { where: { id } }
    );

    if (updateRead === 0) {
        throw new NotFountError('Notificación no encontrada')
    }


}

export const allRead = async () => {
    // Actualiza todas las notificaciones marcándolas como leídas
    const result = await Notifcaciones.update(
        { leido: true },
        {
            where: { leido: false },
        }
    );

    return result;
};

export const deleteNotification = async (id) => {
    if (!id) throw new MissingDataError('Se requiere de una id para eliminar una notificacion')

    const deletedCount = await Notifcaciones.destroy({
        where: { id },
    });

    if (deletedCount === 0) {
        throw new NotFountError('No se pudo eliminar la notificacion')
    }

    const notificaciones = await getAllNotificaciones();

    return notificaciones
}

