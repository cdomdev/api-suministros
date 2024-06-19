import { Invitado } from "../models/usersModels.js";
import { DetallesPedido } from "../models/inventaryModel.js";
import { client } from "../controllers/user/mercadoPagoConfig.js";
import axios from "axios";

//  crear un nuevo usuario con rol de invitado
export const createNewGuest = async (user) => {
  try {
    const guest = await Invitado.create({
      nombre: user.nombre,
      apellidos: user.apellidos,
      direccion: user.direccion,
      telefono: user.telefono,
      email: user.email,
      detalles: user.detalles,
    });
    return guest;
  } catch (error) {
    console.log("Error en la creacion del usuario", error);
    throw error;
  }
};

// actualizar datos del pedido
export const updateDetallesPedido = async (status_detail, id, pedidoId) => {
  try {
    const [affectedRows] = await DetallesPedido.update(
      {
        status_detail: status_detail,
        order_id: id,
      },
      {
        where: { pedido_id: pedidoId },
      }
    );

    if (affectedRows > 0) {
      return true;
    } else {
      console.error(
        `No se encontraron registros para actualizar con el pedido ID ${pedidoId}.`
      );
      return false;
    }
  } catch (error) {
    console.error(
      "Error al actualizar los datos en detalles del pedido:",
      error
    );
    return null;
  }
};

//  referecnias del payment en merchan_order
export const handleMerchantOrderNotification = async (body, res) => {
  const merchantOrderUrl = body.resource;

  try {
    const orderResponse = await axios.get(merchantOrderUrl, {
      headers: { Authorization: `Bearer ${client.accessToken}` },
    });

    if (orderResponse.status === 200) {
      const orderData = orderResponse.data;

      if (orderData.payments && orderData.payments.length > 0) {
        for (let payment of orderData.payments) {
          await handlePaymentNotification({ data: { id: payment.id } }, res);
        }
      } else {
        console.log("No hay pagos asociados a esta orden de comerciante");
        return res
          .status(200)
          .send("Merchant order received but no payments processed");
      }
    } else {
      console.log("Error obteniendo datos de la orden de comerciante");
      return res.status(500).send("Error processing merchant order data");
    }
  } catch (error) {
    console.error("Error en la solicitud de la orden de comerciante:", error);
    return res
      .status(500)
      .send("Error en la solicitud de la orden de comerciante");
  }
};

// buscar datos del payment
export const handlePaymentNotification = async (body, res) => {
  const paymentId = body.data.id;
  console.log("Procesando pago con ID:", paymentId);

  try {
    const paymentUrl = `https://api.mercadopago.com/v1/payments/${paymentId}`;
    const paymentResponse = await axios.get(paymentUrl, {
      headers: { Authorization: `Bearer ${client.accessToken}` },
    });

    if (paymentResponse.status === 200) {
      const paymentData = paymentResponse.data;

      const { external_reference, status_detail, id } = paymentData;

      if (!external_reference || !status_detail || !id) {
        console.error("Faltan propiedades en paymentData:", paymentData);
        return res.status(500).send("Error: Datos de pago incompletos");
      }

      const pedidoId = Number(external_reference);

      const result = await updateDetallesPedido(status_detail, id, pedidoId);

      if (result) {
        return res.status(200).send("Webhook received and processed");
      } else {
        console.error("Error actualizando detalles del pedido.");
        return res.status(500).send("Error actualizando detalles del pedido");
      }
    } else {
      console.log("Datos no procesados");
      return res.status(500).send("Error processing payment data");
    }
  } catch (error) {
    console.error("Error en la solicitud del pago:", error);
    return res.status(500).send("Error en la solicitud del pago");
  }
};

export const createItemsMercadoPago = (cartItems, costoEnvio) => {
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

  return mercadoPagoItems;
};
