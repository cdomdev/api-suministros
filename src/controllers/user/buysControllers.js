import { sendMailsCompra } from "../../../templates/emailTemplatesJs/index.js";
import { conecction } from "../../../database/conecction.js";
import { createNotifications } from "../../helpers/notifications.js";
import { findOrCreateInvited } from "../../helpers/invitadoHelper.js";
import { createOrderUser, createOrderinvited } from '../../helpers/ordersHelpers.js'
import { findOrUpdateDataUser } from "../../helpers/userHelper.js";
import { ErrorServer, MissingDataError, OrderNotFountError } from '../../helpers/errorsInstances.js'


export const finalizarCompraInvitado = async (req, res) => {
  const t = await conecction.transaction();
  const { productos, datos, valorDeEnvio } = req.body;

  try {

    if (!productos || !datos || !valorDeEnvio) {
      throw new MissingDataError("Faltan datos para procesar el pago");
    }


    const usuarioInvitado = await findOrCreateInvited(datos);


    await createOrderinvited(usuarioInvitado.id, productos, valorDeEnvio, t)


    await t.commit();

    sendMailsCompra(0, usuarioInvitado, productos, valorDeEnvio);

    createNotifications(datos);

    return res.status(200).json({ message: "Compra realizada con exito" });

  } catch (error) {
    console.log('Error en el proceso de pago del usuario invitado', error)
    await t.rollback();
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof OrderNotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error("Error en el controlador de finalizar compra invitado:", error);
      return res.status(500).json({ error: new ErrorServer().message });
    }

  }
};

export const finalizarCompraUsuario = async (req, res) => {
  const t = await conecction.transaction();
  const { productos, datos, valorDeEnvio } = req.body;

  try {

    if (!productos || !datos || !valorDeEnvio) {
      throw new MissingDataError("Faltan datos para procesar el pago");
    }

    const user = await findOrUpdateDataUser(datos)

    await createOrderUser(user.id, datos, productos, valorDeEnvio, t)

    await t.commit();

    createNotifications(user);

    sendMailsCompra(0, user, productos, valorDeEnvio)

    return res.status(200).json({ message: "Compra realizada con éxito" });

  } catch (error) {
    console.error("Error en el controlador de finalizar compra usuario:", error);
    await t.rollback();
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof OrderNotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};
