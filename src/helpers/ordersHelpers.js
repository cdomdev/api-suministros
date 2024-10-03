import crypto from "crypto";
import { Pedido, DetallesPedido, Productos } from "../models/index.js"
import { calcularTotal, subTotal } from "../utils/valoresDeProductos.js";
import { updateDataUser } from "./userHelper.js";
import { OrderNotFountError } from "./errorsInstances.js";
import { validarDescuento } from "../utils/findDiscount.js";

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
      throw new OrderNotFountError("Error al crear el pedido");
    }

    await createDetailsOrders(productos, nuevoPedido, transaction);
    return nuevoPedido;
  } catch (error) {
    throw error;
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
      throw new OrderNotFountError("Error al crear el pedido");
    }

    await createDetailsOrders(productos, nuevoPedido, transaction);
    return nuevoPedido;
  } catch (error) {
    throw error;
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
      throw new OrderNotFountError("Error al crear el pedido");
    }

    await createDetailsOrders(productos, nuevoPedido, transaction);
    return nuevoPedido;
  } catch (error) {
    throw error;
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
      throw new OrderNotFountError("Error al crear el pedido");
    }

    await createDetailsOrders(productos, nuevoPedido, transaction);
    return nuevoPedido;
  } catch (error) {
    throw error;
  }
};


export const createDetailsOrders = async (
  productos,
  pedido,
  transaction
) => {

  try {

    const detalles = productos.map(producto => ({
      pedido_id: pedido.id,
      producto_id: producto.id,
      precio_unitario: validarDescuento(producto),
      sub_total: subTotal(producto),
      cantidad: producto.quantity,
      descuento: producto.discount ? producto.discount : 0
    }));

    await DetallesPedido.bulkCreate(detalles, { transaction });

    await updateMasVendidos(productos)

  } catch (error) {
    console.log("Error al crear un pedido", error.message);
    throw error
  }
};


export const updateMasVendidos = async (productos) => {
  try {
    for (const producto of productos) {
      await Productos.update(
        { sales_count: producto.sales_count + 1 },
        { where: { id: producto.id } }
      );
    }
  } catch (error) {
    throw new Error('Error al actulzar datos de mas vendidos', error.message)
  }


}


export const updateDataPedido = async (status_detail, id, pedidoId) => {
  try {
    const [affectedRows] = await Pedido.update(
      {
        status_mercadopago: status_detail,
        mercadopago_id: id,
      },
      {
        where: { id: pedidoId },
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

