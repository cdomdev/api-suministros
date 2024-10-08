import { Notifcaciones } from "../../models/notificaciones.js";
import { NotFountError } from "../errorsInstances.js";

export const createNotifications = async (data) => {
  const notificacion = await Notifcaciones.create({
    mensaje: `El usuario ${data.name || data.nombre
      } ha creado un nuevo pedido`,
  });

  if (!notificacion) {
    throw new NotFountError('Hubo un error al crear un notificacion ')
  }

  return notificacion;
};
