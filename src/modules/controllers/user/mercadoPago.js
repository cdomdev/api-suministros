import axios from "axios";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { Invitado, User } from "../../models/usersModels.js";
import { Pedido, DetallesPedido } from "../../models/inventaryModel.js";
import {
  calcularTotal,
  calcularCantidad,
  subTotal,
} from "../../utils/valoresDeProductos.js";
import { sendMailsCompra } from "../../../../functions/sendMailsCompra.js";

// Configura las credenciales de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken:
    "TEST-5505405215799840-031710-e8a57a0c465797dfb354fc344f5b8080-1732396978",
});

export const createPreferenceUser = async (req, res) => {
  const { updatedCart, data, metodoPago } = req.body;
  const { valorTotalConEnvio, items, envio } = updatedCart;

  try {
    // Verificar que haya al menos un producto y que el valor total con envío esté definido
    if (!items || items.length === 0 || !valorTotalConEnvio) {
      return res
        .status(400)
        .json({ message: "Faltan datos para procesar el pago" });
    }

    // Construir el array de items para Mercado Pago
    const mercadoPagoItems = items.map((item) => ({
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: Number(item.valor),
    }));

    // Agregar el envío como un solo item al array de items para Mercado Pago
    if (envio > 0) {
      mercadoPagoItems.push({
        title: "Costo de envío",
        quantity: 1,
        unit_price: envio,
      });
    }

    const body = {
      items: mercadoPagoItems,
      back_urls: {
        success: "http://localhost:3000/feedback",
        failure: "http://localhost:3000/feedback",
        pending: "http://localhost:3000/feedback",
      },
      auto_return: "approved",
      notification_url:
        "https://7ab2-179-51-118-56.ngrok-free.app/webhooks-user",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    // Validar el usuario en base de datos
    let user = await User.findOne({ where: { email: data.email } });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar datos del usuario si se proporcionan
    if (data.telefono || data.direccion || data.detalles) {
      await User.update(
        {
          telefono: data.telefono || user.telefono,
          direccion: data.direccion || user.direccion,
          detalles: data.detalles || user.detalles,
        },
        { where: { email: data.email } }
      );
    }

    // Crear pedido
    const nuevoPedido = await Pedido.create({
      total: calcularTotal(updatedCart.items),
      cantidad: calcularCantidad(updatedCart.items),
      metodo_pago: metodoPago,
      invitado_id: null,
      usuario_id: user.id,
      preference_id: result.id,
    });

    // Validar creación del pedido
    if (!nuevoPedido) {
      return res.status(501).json({ message: "Error al crear el pedido" });
    }

    // Crear detalles del pedido
    for (const producto of updatedCart.items) {
      await DetallesPedido.create({
        pedido_id: nuevoPedido.id,
        producto_id: producto.id,
        cantidad: producto.cantidad,
        precio_unitario: producto.valor,
        sub_total: producto.valor * producto.cantidad,
        total_pago: producto.valor,
        descuento: producto.descuento | 0,
      });
    }

    // Enviar correo electrónico usuario
    sendMailsCompra(0, user.nombre, user.email, nuevoPedido, updatedCart.items);

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
  const { updatedCart, data, metodoPago } = req.body;
  const { valorTotalConEnvio, items, envio } = updatedCart;

  try {
    // Verificar que haya al menos un producto y que el valor total con envío esté definido
    if (!items || items.length === 0 || !valorTotalConEnvio) {
      return res
        .status(400)
        .json({ message: "Faltan datos para procesar el pago" });
    }
    // const valorConEnvio = items.valor;
    console.log("valor de envio", envio);

    // Construir el array de items para Mercado Pago
    const mercadoPagoItems = items.map((item) => ({
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: Number(item.valor),
    }));

    // Agregar el envío como un solo item al array de items para Mercado Pago
    if (envio > 0) {
      mercadoPagoItems.push({
        title: "Costo de envío",
        quantity: 1,
        unit_price: envio,
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
        "https://7ab2-179-51-118-56.ngrok-free.app/webhooks-invited",
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

    // creacion de usuario invitado
    if (!usuarioInvitado) {
      return res.status(500).json({ message: "Error al crear el usuario" });
    }
    // crear pedido
    const nuevoPedido = await Pedido.create({
      total: calcularTotal(updatedCart.items),
      cantidad: calcularCantidad(updatedCart.items),
      metodo_pago: metodoPago,
      invitado_id: usuarioInvitado.id,
      usuario_id: null,
      id_pago_mercadopago: result.id,
    });

    // validar cracion del pedido
    if (!nuevoPedido) {
      return res.status(401).json({ message: "Error al crear el pedido" });
    }

    // crear detalles del pédido
    for (const producto of updatedCart.items) {
      await DetallesPedido.create({
        pedido_id: nuevoPedido.id,
        producto_id: producto.id,
        cantidad: calcularCantidad(updatedCart.items),
        precio_unitario: producto.valor,
        sub_total: subTotal(updatedCart.items),
        total_pago: producto.valor,
        descuento: producto.descuento | 0,
      });
    }

    // Enviar correo electrónico usuario
    sendMailsCompra(
      0,
      usuarioInvitado.nombre,
      usuarioInvitado.email,
      nuevoPedido,
      updatedCart.items
    );

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
      console.log("Información del pago:", data);

      // extraer datos de la compra
      const userId = data.payer.id;
      const productDescription = data.description;
      const paymentType = data.payment_type_id;

      // insertar el estado del pago en la tabla detalles pedido

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
