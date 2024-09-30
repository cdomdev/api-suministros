import { Preference } from "mercadopago";
import { client } from "./mercadoPagoConfig.js";
import {aplicarDescuento} from '../utils/aplicarDescuento.js'

export const createMercadoPagoPreferenceInvited = async (items, pedidoId) => {
    try {
        const body = {
            items: items,
            back_urls: {
                success: "https://7435-179-51-118-55.ngrok-free.app/feedback",
                failure: "http://localhost:3000/feedback",
                pending: "http://localhost:3000/feedback",
            },
            auto_return: "approved",
            notification_url: "https://f39a-179-51-118-54.ngrok-free.app/webhooks-invited",
            external_reference: `${pedidoId}`,
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });

        return result;
    } catch (error) {
        throw error;
    }
};


export const createMercadoPagoPreferenceUser = async (items, pedidoId) => {
    try {
        const body = {
            items: items,
            back_urls: {
                success: "https://7435-179-51-118-55.ngrok-free.app/feedback",
                failure: "http://localhost:3000/feedback",
                pending: "http://localhost:3000/feedback",
            },
            auto_return: "approved",
            notification_url: "https://f39a-179-51-118-54.ngrok-free.app/webhooks-user",
            external_reference: `${pedidoId}`,
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });

        return result;
    } catch (error) {
        throw error;
    }
};


export const createItemsMercadoPago = (productos, costoEnvio) => {
    try {
        // Construir el array de items para Mercado Pago
    const mercadoPagoItems = productos.map((item) => ({
        title: item.nombre,
        quantity: item.quantity,
        unit_price: aplicarDescuento(item)
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
    } catch (error) {
        throw error
    }
    
};


