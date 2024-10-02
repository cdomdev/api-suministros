import { sendMailsCompraMercadoPago } from "../../../templates/emailTemplatesJs/index.js";
import { findOrCreateInvited } from "../../helpers/invitadoHelper.js";
import { createMercadoPagoPreferenceInvited, createItemsMercadoPago } from "../../helpers/mercadoPagoHelper.js";
import { createOrderMercadopagoInvited } from '../../helpers/ordersHelpers.js'
import { ErrorServer, MissingDataError, OrderNotFountError } from '../../helpers/errorsInstances.js'

export const createPreferenceInvited = async (req, res) => {
  const { productos, datos, valorDeEnvio } = req.body;
  const t = await conecction.transaction();
  try {

    if (!productos || !datos || !valorDeEnvio) {
      throw new MissingDataError("Faltan datos para procesar el pago");
    }

    const user = await findOrCreateInvited(datos);

    const nuevoPedido = await createOrderMercadopagoInvited(user.id, productos, valorDeEnvio);

    const mercadoPagoItems = await createItemsMercadoPago(productos, valorDeEnvio);

    const preferenceMercadopago = await createMercadoPagoPreferenceInvited(mercadoPagoItems, nuevoPedido.id);

    await t.commit();

    setTimeout(() => {
      sendMailsCompraMercadoPago(0, user, productos, valorDeEnvio);
    }, 1 * 60 * 1000);

    res.status(200).json({
      id: preferenceMercadopago.id,
      init_point: preferenceMercadopago.init_point,
      message: "success",
    });

  } catch (error) {
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
