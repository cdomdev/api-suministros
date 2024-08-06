import { Preference } from "mercadopago";
import { User } from "../../models/index.js";
import { client } from "../../helpers/mercadoPagoConfig.js";
import { sendMailsCompraMercadoPago } from "../../../templates/emailTemplatesJs/index.js";
import {
  createDetailsOrders,
  createOrderAsUser,
} from "../../helpers/createDetailsOrdes.js";
import { createItemsMercadoPago } from "../../utils/createItemsMercadoPago.js";

export const createPreferenceUser = async (req, res) => {
  const { cartItems, data, metodoPago, costoEnvio } = req.body;
  try {
    // Verificar que haya al menos un producto y que el valor total con envío esté definido
    if (!cartItems || cartItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Faltan datos para procesar el pago" });
    }

    // crear items mercado pago
    let mercadoPagoItems = createItemsMercadoPago(cartItems, costoEnvio);

    let user = await User.findOne({ where: { email: data.email } });

    let nuevoPedido = await createOrderAsUser(user);

    // crear detaelles del pedido
    createDetailsOrders(cartItems, costoEnvio, metodoPago, nuevoPedido);

    // // validar cracion del pedido
    if (!nuevoPedido) {
      return res.status(400).json({ message: "Error al crear el pedido" });
    }

    // crear cuerpo de compra para mercado pago
    const body = {
      items: mercadoPagoItems,
      back_urls: {
        success: "https://7435-179-51-118-55.ngrok-free.app/feedback",
        failure: "http://localhost:3000/feedback",
        pending: "http://localhost:3000/feedback",
      },
      auto_return: "approved",
      notification_url:
        "https://3e75-191-156-50-109.ngrok-free.app/webhooks-user",
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
      message: "compra guardada y Preferencia creada con éxito",
    });
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
