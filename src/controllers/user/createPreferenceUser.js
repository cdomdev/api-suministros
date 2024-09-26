import { sendMailsCompraMercadoPago } from "../../../templates/emailTemplatesJs/index.js";
import { createItemsMercadoPago } from "../../utils/createItemsMercadoPago.js";
import { findUser } from "../../helpers/findUser.js";
import { createOrderMercadopagoUser } from "../../helpers/createOrder.js";
import { createMercadoPagoPreferenceUser } from "../../helpers/mercadoPagoHelper.js";

export const createPreferenceUser = async (req, res) => {
  const { productos, datos, valorDeEnvio } = req.body;
  try {
    if (!productos || !datos || !valorDeEnvio) {
      return res.status(400).json({ message: "Faltan datos para procesar el pago" });
    }

    const user = await findUser(datos);

    const nuevoPedido = await createOrderMercadopagoUser(user.id, productos, valorDeEnvio)

    const mercadoPagoItems = createItemsMercadoPago(productos, valorDeEnvio);


    const preferenceMercadopago = await createMercadoPagoPreferenceUser(mercadoPagoItems, nuevoPedido.id);

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
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
