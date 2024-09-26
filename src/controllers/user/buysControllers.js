import { sendMailsCompra } from "../../../templates/emailTemplatesJs/index.js";
import { conecction } from "../../../database/conecction.js";
import { createNotifications } from "../../helpers/notifications.js";
import { findOrCreateInvited } from "../../helpers/invitadoHelper.js";
import { createOrderUser, createOrderinvited } from '../../helpers/createOrder.js'
import { finOrUpdateDataUser } from "../../helpers/userHelper.js";

export const finalizarCompraInvitado = async (req, res) => {
  const { productos, datos, valorDeEnvio } = req.body;
  const t = await conecction.transaction();
  try {
    if (!productos || !datos || !valorDeEnvio) {
      return res.status(400).json({ message: "Faltan datos para procesar el pago" });
    }

    const usuarioInvitado = await findOrCreateInvited(datos);

    await createOrderinvited(usuarioInvitado.id, productos, valorDeEnvio, t)

    await t.commit();

    sendMailsCompra(0, usuarioInvitado, productos, valorDeEnvio);

    createNotifications(datos);

    return res.status(200).json({ message: "Compra realizada con exito" });
  } catch (e) {
    await t.rollback();
    console.log("Error al finalizar la compra", e);
    return res.status(502).json({ message: "Error interno en el servidor" });
  }
};

export const finalizarCompraUsuario = async (req, res) => {
  const t = await conecction.transaction();
  const { productos, datos, valorDeEnvio } = req.body;
  try {

    if (!productos || !datos || !valorDeEnvio) {
      return res.status(400).json({ message: "Faltan datos de la compra" });
    }

    const user = await finOrUpdateDataUser(datos)

    await createOrderUser(user.id, datos, productos, valorDeEnvio, t)

    await t.commit();

    createNotifications(user);

    sendMailsCompra(0, user, productos, valorDeEnvio)

    return res.status(200).json({ message: "Compra realizada con éxito" });

  } catch (error) {
    await t.rollback();
    console.error("Error al finalizar la compra", error);
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};
