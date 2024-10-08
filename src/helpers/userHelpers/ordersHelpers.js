import crypto from "crypto";
import { Pedido, DetallesPedido, Productos } from "../../models/index.js"
import { calcularTotal, subTotal } from "../../utils/valoresDeProductos.js";
import { updateDataUser } from "./authHelper.js";
import { NotFountError, MissingDataError } from "../errorsInstances.js";
import { validarDescuento } from "../../utils/findDiscount.js";
import { findOrCreateInvited } from "./invitadoHelper.js";
import { sendMailsCompra } from "../../../templates/emailTemplatesJs/sendMailsCompra.js";
import { findUser } from "./findUser.js";
import { createNotifications } from '../userHelpers/notifications.js'

export const createOrderMercadopagoInvited = async (productos, datos, valorDeEnvio, transaction) => {

  if (!productos || !datos || !valorDeEnvio) {
    throw new MissingDataError("Faltan datos para procesar el pago en mercadopago");
  }

  let usuario = await findOrCreateInvited(datos);

  const totalPago = calcularTotal(productos) + valorDeEnvio;
  const nuevoPedido = await Pedido.create({
    id: crypto.randomUUID(),
    invitado_id: usuario.id,
    usuario_id: null,
    costo_de_envio: valorDeEnvio,
    pago_total: totalPago,
    metodo_de_pago: "mercadopago",
  }, { transaction });

  if (!nuevoPedido) {
    throw new NotFountError("Error al crear el pedido");
  }

  await createDetailsOrders(productos, nuevoPedido, usuario, valorDeEnvio, datos, transaction);
  return nuevoPedido;
};

export const createOrderMercadopagoUser = async (productos, datos, valorDeEnvio, transaction) => {

  if (!productos || !datos || !valorDeEnvio) {
    throw new MissingDataError("Faltan datos para procesar el pago en mercadopago");
  }

  let usuario = await findUser(datos);

  const totalPago = calcularTotal(productos) + valorDeEnvio;
  const nuevoPedido = await Pedido.create({
    id: crypto.randomUUID(),
    invitado_id: null,
    usuario_id: user.id,
    costo_de_envio: valorDeEnvio,
    pago_total: totalPago,
    metodo_de_pago: "mercadopago",
  }, { transaction });

  if (!nuevoPedido) {
    throw new NotFountError("Error al crear el pedido");
  }

  await createDetailsOrders(productos, nuevoPedido, usuario, valorDeEnvio, transaction);
  return nuevoPedido;
};


export const createOrderUser = async (productos, datos, valorDeEnvio, transaction) => {

  if (!productos || !datos || !valorDeEnvio) {
    throw new MissingDataError("Faltan datos para procesar el pago");
  }

  let usuario = await updateDataUser(datos)

  const totalPago = calcularTotal(productos) + valorDeEnvio;

  const nuevoPedido = await Pedido.create({
    id: crypto.randomUUID(),
    invitado_id: null,
    usuario_id: usuario.id,
    costo_de_envio: valorDeEnvio,
    pago_total: totalPago,
    metodo_de_pago: "contra-entrega",
  }, { transaction });

  if (!nuevoPedido) {
    throw new NotFountError("Error al crear el pedido");
  }

  await createDetailsOrders(productos, nuevoPedido, usuario, valorDeEnvio, datos, transaction);

  return nuevoPedido;

};


export const createOrderinvited = async (productos, datos, valorDeEnvio, transaction) => {

  if (!productos || !datos || !valorDeEnvio) {
    throw new MissingDataError("Faltan datos para procesar el pago");
  }

  const totalPago = calcularTotal(productos) + valorDeEnvio;

  const usuarioInvitado = await findOrCreateInvited(datos);

  const nuevoPedido = await Pedido.create({
    id: crypto.randomUUID(),
    invitado_id: usuarioInvitado.id,
    usuario_id: null,
    costo_de_envio: valorDeEnvio,
    pago_total: totalPago,
    metodo_de_pago: "contra-entrega",
  }, { transaction });

  if (!nuevoPedido) {
    throw new NotFountError("Error al crear el pedido");
  }

  await createDetailsOrders(productos, nuevoPedido, usuarioInvitado, valorDeEnvio, datos, transaction);

  return nuevoPedido;
};


export const createDetailsOrders = async (
  productos,
  pedido,
  usuario,
  valorDeEnvio,
  datos,
  transaction
) => {

  const detalles = productos.map(producto => ({
    pedido_id: pedido.id,
    producto_id: producto.id,
    precio_unitario: validarDescuento(producto),
    sub_total: subTotal(producto),
    cantidad: producto.quantity,
    descuento: producto.discount ? producto.discount : 0
  }));

  await DetallesPedido.bulkCreate(detalles, { transaction });

  await updateMasVendidos(productos, transaction)

  await createNotifications(datos);

  sendMailsCompra(0, usuario, productos, valorDeEnvio)

};

export const updateMasVendidos = async (productos, transaction) => {
  for (const producto of productos) {
    await Productos.update(
      { sales_count: producto.sales_count + 1 },
      { where: { id: producto.id }, transaction }
    );
  }
}

export const updateDataPedido = async (status_detail, id, pedidoId) => {
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
};

