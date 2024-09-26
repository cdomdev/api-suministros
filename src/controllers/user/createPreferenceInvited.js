import { createItemsMercadoPago } from "../../utils/createItemsMercadoPago.js";
import { sendMailsCompraMercadoPago } from "../../../templates/emailTemplatesJs/index.js";
import { findOrCreateInvited } from "../../helpers/invitadoHelper.js";
import { createMercadoPagoPreferenceInvited } from "../../helpers/mercadoPagoHelper.js";
import { createOrderMercadopagoInvited } from '../../helpers/createOrder.js'

export const createPreferenceInvited = async (req, res) => {
  const { productos, datos, valorDeEnvio } = req.body;

  try {
    if (!productos || !datos || !valorDeEnvio) {
      return res.status(400).json({ message: "Faltan datos para procesar el pago" });
    }

    const user = await findOrCreateInvited(datos);

    const nuevoPedido = await createOrderMercadopagoInvited(user.id, productos, valorDeEnvio);

    const mercadoPagoItems = await createItemsMercadoPago(productos, valorDeEnvio);

    const preferenceMercadopago = await createMercadoPagoPreferenceInvited(mercadoPagoItems, nuevoPedido.id);

    setTimeout(() => {
      sendMailsCompraMercadoPago(0, user, productos, valorDeEnvio);
    }, 1 * 60 * 1000);

    res.status(200).json({
      id: preferenceMercadopago.id,
      init_point: preferenceMercadopago.init_point,
      message: "success",
    });

  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return res.status(501).json({ message: "Error en el servidor" });
  }
};
