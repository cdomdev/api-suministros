import { calcularTotal, subTotal } from "./valoresDeProductos.js";
import { DetallesPedido } from "../models/inventaryModel.js";

// crear detalles del pédido
export const createDetailsOrders = async (
  productos,
  envio,
  metodoPago,
  pedido
) => {
  for (const producto of productos) {
    let totalPago = calcularTotal(productos) + envio;
    let sub_total = subTotal(productos);
    let precioUnitario = producto.valor;
    let cantidad = producto.cantidad;
    let costoDeEnvio = envio;
    let pedidoId = pedido.id;
    let productoId = producto.id;
    let descuento = producto.descuento ? producto.descuento : 0;

    await DetallesPedido.create({
      pedido_id: pedidoId,
      producto_id: productoId,
      precio_unitario: precioUnitario,
      sub_total: sub_total,
      costo_de_envio: costoDeEnvio,
      total_pago: totalPago,
      cantidad: cantidad,
      metodo_pago: metodoPago,
      descuento: descuento,
    });
  }
};
