import { Preference } from "mercadopago";
import { client } from "./mercadoPagoConfig.js";
import {
  createDetailsOrders,
  createOrderAsGuest,
} from "../../utils/createDetailsOrdes.js";
import {
  createItemsMercadoPago,
  createNewGuest,
} from "../../utils/itesmProcessMercadoPago.js";
import { sendMailsCompraMercadoPago } from "../../../../functions/sendMailsCompraMercadoPago.js";

export const createPreferenceInvited = async (req, res) => {
  const { cartItems, data, metodoPago, costoEnvio } = req.body;

  try {
    if (
      !cartItems ||
      cartItems.length === 0 ||
      !costoEnvio ||
      !data ||
      !metodoPago
    ) {
      return res
        .status(400)
        .json({ message: "Faltan datos para procesar el pago" });
    }

    let mercadoPagoItems = createItemsMercadoPago(cartItems, costoEnvio);

    // crear el usuario invitado
    let user = await createNewGuest(data);

    if (!user) {
      return res.status(400).json({ message: "Error en el proceso de compra" });
    }

    // Crear pedido
    let nuevoPedido = await createOrderAsGuest(user);

    // crear detaelles del pedido
    createDetailsOrders(cartItems, costoEnvio, metodoPago, nuevoPedido);
    // // validar cracion del pedido
    if (!nuevoPedido) {
      return res.status(400).json({ message: "Error al crear el pedido" });
    }

    const body = {
      items: mercadoPagoItems,
      back_urls: {
        success: "https://7435-179-51-118-55.ngrok-free.app/feedback",
        failure: "http://localhost:3000/feedback",
        pending: "http://localhost:3000/feedback",
      },
      auto_return: "approved",
      notification_url:
        "https://3e75-191-156-50-109.ngrok-free.app/webhooks-invited",
      external_reference: `${nuevoPedido.id}`,
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    // Enviar correo después de 1 minutos
    setTimeout(() => {
      sendMailsCompraMercadoPago(0, user, cartItems, costoEnvio);
    }, 1 * 60 * 1000);

    res.status(200).json({
      id: result.id,
      init_point: result.init_point,
      message: "Preferencia creada con éxito",
    });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return res.status(501).json({ message: "Error en el servidor" });
  }
};
