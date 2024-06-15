import axios from "axios";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { Invitado, User } from "../../models/usersModels.js";
import { Pedido, DetallesPedido } from "../../models/inventaryModel.js";
import { createDetailsOrders } from "../../utils/createDetailsOrdes.js";
import { sendMailsCompraMercadoPago } from "../../../../functions/sendMailsCompraMercadoPago.js";

// Configura las credenciales de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken:
    "TEST-5505405215799840-031710-e8a57a0c465797dfb354fc344f5b8080-1732396978",
});

export const createPreferenceUser = async (req, res) => {
  const { cartItems, data, metodoPago, costoEnvio } = req.body;

  try {
    // Verificar que haya al menos un producto y que el valor total con envío esté definido
    if (!cartItems || cartItems.length === 0 || !costoEnvio) {
      return res
        .status(400)
        .json({ message: "Faltan datos para procesar el pago" });
    }

    // Construir el array de items para Mercado Pago
    const mercadoPagoItems = cartItems.map((item) => ({
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: Number(item.valor),
    }));

    // Agregar el envío como un solo item al array de items para Mercado Pago
    if (costoEnvio > 0) {
      mercadoPagoItems.push({
        title: "Costo de envío",
        quantity: 1,
        unit_price: costoEnvio,
      });
    }
    // crear referencia de usuario en mercado pago
    let user = await User.findOne({ where: { email: data.email } });

    // crear pedido
    const nuevoPedido = await Pedido.create({
      invitado_id: null,
      usuario_id: user.id,
    });

    // crear detaelles del pedido
    createDetailsOrders(cartItems, costoEnvio, metodoPago, nuevoPedido);

    // crear cuerpo de compra para mercado pago
    const body = {
      items: mercadoPagoItems,
      back_urls: {
        success: "http://localhost:3000/feedback",
        failure: "http://localhost:3000/feedback",
        pending: "http://localhost:3000/feedback",
      },
      auto_return: "approved",
      notification_url:
        "https://4b74-179-51-118-54.ngrok-free.app/webhooks-user",
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

export const createPreferenceInvited = async (req, res) => {
  const { cartItems, data, metodoPago, costoEnvio } = req.body;

  try {
    // Verificar que haya al menos un producto y que el valor total con envío esté definido
    if (!cartItems || cartItems.length === 0 || !costoEnvio) {
      return res
        .status(400)
        .json({ message: "Faltan datos para procesar el pago" });
    }
    let user;

    // Construir el array de items para Mercado Pago
    const mercadoPagoItems = cartItems.map((item) => ({
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: Number(item.valor),
    }));

    // Agregar el envío como un solo item al array de items para Mercado Pago
    if (costoEnvio > 0) {
      mercadoPagoItems.push({
        title: "Costo de envío",
        quantity: 1,
        unit_price: costoEnvio,
      });
    }

    const body = {
      items: mercadoPagoItems,
      back_urls: {
        success: " https://1cfb-179-51-118-56.ngrok-free.app/feedback",
        failure: "http://localhost:3000/feedback",
        pending: "http://localhost:3000/feedback",
      },
      auto_return: "approved",
      notification_url:
        "https://72eb-179-51-118-55.ngrok-free.app/webhooks-invited",
      external_reference: `${user.id}-${nuevoPedido.id}`,
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    // crear el nuevo invitado
    let nombreUsuario = data.nombre;
    const { apellidos, email, direccion, telefono, detalles } = data;

    const usuarioInvitado = await Invitado.create({
      nombre: nombreUsuario,
      apellidos: apellidos,
      direccion: direccion,
      telefono: telefono,
      email: email,
      detalles: detalles,
    });

    user = usuarioInvitado;
    // creacion de usuario invitado
    if (!usuarioInvitado) {
      return res.status(500).json({ message: "Error al crear el usuario" });
    }
    // crear pedido
    const nuevoPedido = await Pedido.create({
      invitado_id: usuarioInvitado.id,
      usuario_id: null,
    });

    // // validar cracion del pedido
    if (!nuevoPedido) {
      return res.status(401).json({ message: "Error al crear el pedido" });
    }

    // crear detaelles del pedido
    createDetailsOrders(cartItems, costoEnvio, metodoPago, nuevoPedido);

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

let processing = false;

export const reciveWebhookUser = async (req, res) => {
  if (processing) {
    // Ya hay una solicitud en proceso
    console.log("La solicitud ya está siendo procesada.");
    return res.sendStatus(200);
  }

  processing = true;

  let id;
  if (req.query.id) {
    id = req.query.id;
  } else if (req.query["data.id"]) {
    id = req.query["data.id"];
  } else {
    console.error("No se encontró el ID del pago en la consulta.");
    processing = false;
    return res.sendStatus(400);
  }

  try {
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${id}`,
      {
        headers: {
          Authorization: `Bearer ${client.accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;

      const { external_reference, status_detail, order } = data;

      const pedidoId = Number(external_reference);

      // actulizar datos de la compra

      const detallesPedido = await DetallesPedido.update(
        {
          status_detail: status_detail,
          order_id: order.id,
        },
        {
          where: { pedido_id: pedidoId },
        }
      );

      processing = false;

      // Envía una respuesta 200 OK
      return res.sendStatus(200);
    } else {
      console.log(
        "Error al obtener los detalles del pago:",
        response.statusText
      );
      processing = false;
      return res.sendStatus(500);
    }
  } catch (error) {
    console.error("Error en la solicitud del pago:", error);
    processing = false;
    return res.sendStatus(500);
  }
};

export const reciveWebhookInvited = async (req, res) => {
  if (processing) {
    // Ya hay una solicitud en proceso
    console.log("La solicitud ya está siendo procesada.");
    return res.sendStatus(200);
  }

  console.log("query:", req.query);
  processing = true;

  let id;
  if (req.query.id) {
    id = req.query.id;
  } else if (req.query["data.id"]) {
    id = req.query["data.id"];
  } else {
    console.error("No se encontró el ID del pago en la consulta.");
    processing = false;
    return res.sendStatus(400);
  }

  console.log("Este es el ID del pago que se quiere rastrear:", id);

  try {
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${id}`,
      {
        headers: {
          Authorization: `Bearer ${client.accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;
      console.log("Información del pago:", data);

      // Crea el pedido y el detalle del pedido con los datos del pago
      // extraer datos de la compra
      const userId = data.payer.id;
      const productDescription = data.description;
      const paymentType = data.payment_type_id;

      // Se ha completado el procesamiento
      processing = false;

      // Envía una respuesta 200 OK
      return res.sendStatus(200);
    } else {
      console.log(
        "Error al obtener los detalles del pago:",
        response.statusText
      );
      processing = false;
      return res.sendStatus(500);
    }
  } catch (error) {
    console.error("Error en la solicitud del pago:", error);
    processing = false;
    return res.sendStatus(500);
  }
};

export const feedBack = async (req, res) => {
  console.log("Gracias por tu compra");
};
