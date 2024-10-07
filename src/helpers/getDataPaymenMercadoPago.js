import { client } from "../helpers/mercadoPagoConfig.js";
import axios from "axios";
import { updateDataPedido } from '../helpers/ordersHelpers.js'

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

      const pedidoId = external_reference;

      const result = await updateDataPedido(status_detail, id, pedidoId);

      if (result) {
        return res.status(200).send("Webhook received and processed");
      } else {
        console.error("Error actualizando detalles del pedido.");
        throw new NotFountError('Error al intentar actulizar los datos del pedido')
      }
    } else {
      console.log("Datos no procesados");
      throw new NotFountError('Error al procesosar los datos del pago')

};
