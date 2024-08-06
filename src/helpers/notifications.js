import { Notifcaciones } from "../models/notificaciones.js";

export const createNotifications = async (data) => {
  try {
    if (data) {
      const notificacion = await Notifcaciones.create({
        mensaje: `Hola admin, el usuario ${
          data.name || data.nombre
        } ha creado un nuevo pedido`,
      });
      if (notificacion) {
        console.log("Notificacion creada");
      }

      return notificacion;
    } else {
      throw new Error("Datos inválidos para crear la notificación");
    }
  } catch (error) {
    console.log("Error en la creacion de la notificacion", error.message);
  }
};
