import { where } from "sequelize";
import { Notifcaciones } from "../../models/usersModels.js";
// listar notificaciones

export const notificationList = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Acceso no autorizado" });
  }
  try {
    const notifications = await Notifcaciones.findAll();

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
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Acceso no autorizado" });
  }

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
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Acceso no autorizado" });
  }
  const { id } = req.params;

  try {
    const deletedCount = await Notifcaciones.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Notificación no encontrada" });
    }

    res
      .status(200)
      .json({ success: true, message: "Notificación eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la notificación:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar la notificación" });
  }
};
