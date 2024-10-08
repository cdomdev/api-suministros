import { client } from "../../helpers/mercadoPagoConfig.js";
import { updateDataPedido } from "./ordersHelpers.js";
import axios from "axios";
import { NotFountError } from "../errorsInstances.js";

//  referecnias del pago para la db
export const handleMerchantOrderNotification = async (body) => {
    const merchantOrderUrl = body.resource;

    const orderResponse = await axios.get(merchantOrderUrl, {
        headers: { Authorization: `Bearer ${client.accessToken}` },
    });

    if (orderResponse.status === 200) {
        const orderData = orderResponse.data;
        if (orderData.payments && orderData.payments.length > 0) {
            for (let payment of orderData.payments) {
                await handlePaymentNotification({ data: { id: payment.id } });
            }
        }
    } else {
        throw new NotFountError(`Parece que no hay pagos asociados a la orden del comerciante # ${orderData}`)
    }
};



// buscar datos del payment
export const handlePaymentNotification = async (body) => {
    const paymentId = body.data.id;

    const paymentUrl = `https://api.mercadopago.com/v1/payments/${paymentId}`;
    const paymentResponse = await axios.get(paymentUrl, {
        headers: { Authorization: `Bearer ${client.accessToken}` },
    });

    if (paymentResponse.status === 200) {
        const paymentData = paymentResponse.data;

        const { external_reference, status_detail, id } = paymentData;

        const pedidoId = external_reference;

        await updateDataPedido(status_detail, id, pedidoId);

    } else {
        throw new NotFountError('Hubo un error en la solicitud de datos del pago de mercadopago')
    }


}
