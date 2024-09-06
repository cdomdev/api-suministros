import { Notifcaciones } from "../../models/index.js";

export const notificationList = async (req, res) => {
  try {
    const notifications = await listadoNotificaciones();

    if (notifications) {
      res.status(200).json({
        notifications,
        message: "Ok",
      });
    }
  } catch (error) {
    console.log("Error en el lisatdo de notificaciones", error);
    res
      .status(500)
      .json({ success: false, message: "Error al listar notificaciónes" });
  }
};

// marcar como leida

export const tickRead = async (req, res) => {
  const { id } = req.params;

  try {
    const [updateRead] = await Notifcaciones.update(
      { leido: true },
      { where: { id } }
    );

    if (updateRead === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Notificación no encontrada" });
    }
    res.status(200).json({ success: true, message: "Notificación marcada" });
  } catch (error) {
    console.log("Error al marcar la notificacion", error);
    res
      .status(500)
      .json({ success: false, message: "Error al marcar la notificación" });
  }
};

// eliminar

export const deleteNotifications = async (req, res) => {
  const { id } = req.params;
  // if (req.user.role !== "admin") {
  //   return res
  //     .status(403)
  //     .json({ success: false, message: "Acceso no autorizado" });
  // }

  try {
    const deletedCount = await Notifcaciones.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Notificación no encontrada" });
    }
    const notificaciones = await listadoNotificaciones();
    res.status(200).json({ success: true, message: "OK", notificaciones });
  } catch (error) {
    console.error("Error al eliminar la notificación:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar la notificación" });
  }
};

export const listadoNotificaciones = async () => {
  try {
    const notifications = await Notifcaciones.findAll();
    return notifications;
  } catch (error) {
    console.log("Error en el lisatdo de notificaciones", error);
  }
};
