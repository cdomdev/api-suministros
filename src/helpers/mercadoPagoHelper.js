import { Preference } from "mercadopago";
import { client } from "./mercadoPagoConfig.js";

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
        throw new Error("Error al crear la preferencia en Mercado Pago");
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
        throw new Error("Error al crear la preferencia en Mercado Pago");
    }
};
