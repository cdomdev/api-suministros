import { allRead, getAllNotificaciones, updateStateNotificaciones } from "../../helpers/adminHelpers/notificacionesHelpers.js";

export const notificationList = async (req, res) => {
  try {

    const notifications = await getAllNotificaciones();
    res.status(200).json({
      notifications,
      message: "Ok",
    });

  } catch (error) {
    console.log("Error en el lisatdo de notificaciones", error);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};




export const tickRead = async (req, res) => {
  const { id } = req.params;

  try {

    await updateStateNotificaciones(id)

    res.status(200).json({ success: true, message: "Estado de notificación actulizado" });
  } catch (error) {
    console.log("Error al marcar la notificacion", error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};


export const deleteNotifications = async (req, res) => {
  const { id } = req.params;

  try {

    const notificaciones = await deleteNotifications(id);

    res.status(200).json({ success: true, message: "OK", notificaciones });

  } catch (error) {
    console.error("Error al eliminar la notificación:", error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};


export const markAllAsRead = async (req, res) => {
  try {

    await allRead()

    res.status(200).json({ success: true, message: 'OK' })
  } catch (error) {
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
}