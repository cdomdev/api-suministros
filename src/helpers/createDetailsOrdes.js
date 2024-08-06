import { calcularTotal, subTotal } from "../utils/valoresDeProductos.js";
import { DetallesPedido, Pedido, Productos } from "../models/index.js";

// crear pedido
export const createOrderAsUser = async (user) => {
  try {
    // Crea el nuevo pedido
    const nuevoPedido = await Pedido.create({
      invitado_id: null,
      usuario_id: user.id,
    });
    return nuevoPedido;
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    throw error;
  }
};

// crear pedido asignado a un invitado
export const createOrderAsGuest = async (user) => {
  try {
    // Crea el nuevo pedido
    const nuevoPedido = await Pedido.create({
      invitado_id: user.id,
      usuario_id: null,
    });

    return nuevoPedido;
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    throw error;
  }
};

// crear detalles del pédido
export const createDetailsOrders = async (
  productos,
  envio,
  metodoPago,
  pedido
) => {
  const productosVendidos = [];
  try {
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

      // Buscar el producto y agregarlo al array de productos vendidos
      const productoVendido = await Productos.findOne({
        where: { id: productoId },
      });
      if (productoVendido) {
        productosVendidos.push(productoVendido);
      }
    }

    // actulizar nuemros de veces que el producto se vende
    for (const producto of productos) {
      await Productos.update(
        { sales_count: producto.sales_count + 1 },
        { where: { id: producto.id } }
      );
    }
    // Retornar los productos vendidos
    return productosVendidos;
  } catch (error) {
    console.log("Error al crear un pedido", error);
  }
};
