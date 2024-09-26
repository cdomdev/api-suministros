import { Pedido } from "../models/index.js"
import crypto from "crypto";
import { createDetailsOrders } from './createDetailsOrdes.js'
import { calcularTotal } from "../utils/valoresDeProductos.js";
import { updateDataUser } from "./updateDataUser.js";

export const createOrderMercadopagoInvited = async (userId, productos, valorDeEnvio, transaction) => {
    try {
        const totalPago = calcularTotal(productos) + valorDeEnvio;
        const nuevoPedido = await Pedido.create({
            id: crypto.randomUUID(),
            invitado_id: userId,
            usuario_id: null,
            costo_de_envio: valorDeEnvio,
            pago_total: totalPago,
            metodo_de_pago: "mercadopago",
        }, { transaction });

        if (!nuevoPedido) {
            throw new Error("Error al crear el pedido");
        }

        await createDetailsOrders(productos, nuevoPedido, transaction);
        return nuevoPedido;
    } catch (error) {
        throw new Error("Error en la creación del pedido: " + error.message);
    }
};


export const createOrderMercadopagoUser = async (userId, productos, valorDeEnvio, transaction) => {
    try {
        const totalPago = calcularTotal(productos) + valorDeEnvio;
        const nuevoPedido = await Pedido.create({
            id: crypto.randomUUID(),
            invitado_id: null,
            usuario_id: userId,
            costo_de_envio: valorDeEnvio,
            pago_total: totalPago,
            metodo_de_pago: "mercadopago",
        }, { transaction });

        if (!nuevoPedido) {
            throw new Error("Error al crear el pedido");
        }

        await createDetailsOrders(productos, nuevoPedido, transaction);
        return nuevoPedido;
    } catch (error) {
        throw new Error("Error en la creación del pedido: " + error.message);
    }
};

export const createOrderUser = async (userId, datos, productos, valorDeEnvio, transaction) => {
    try {

        await updateDataUser(datos)

        const totalPago = calcularTotal(productos) + valorDeEnvio;

        const nuevoPedido = await Pedido.create({
            id: crypto.randomUUID(),
            invitado_id: null,
            usuario_id: userId,
            costo_de_envio: valorDeEnvio,
            pago_total: totalPago,
            metodo_de_pago: "contra-entrega",
        }, { transaction });

        if (!nuevoPedido) {
            throw new Error("Error al crear el pedido");
        }

        await createDetailsOrders(productos, nuevoPedido, transaction);
        return nuevoPedido;
    } catch (error) {
        throw new Error("Error en la creación del pedido: " + error.message);
    }
};



export const createOrderinvited = async (userId, productos, valorDeEnvio, transaction) => {
    try {
        const totalPago = calcularTotal(productos) + valorDeEnvio;

        const nuevoPedido = await Pedido.create({
            id: crypto.randomUUID(),
            invitado_id: userId,
            usuario_id: null,
            costo_de_envio: valorDeEnvio,
            pago_total: totalPago,
            metodo_de_pago: "contra-entrega",
        }, { transaction });

        if (!nuevoPedido) {
            throw new Error("Error al crear el pedido");
        }

        await createDetailsOrders(productos, nuevoPedido, transaction);
        return nuevoPedido;
    } catch (error) {
        throw new Error("Error en la creación del pedido: " + error.message);
    }
};

