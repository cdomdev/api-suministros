import { subTotal } from "../utils/valoresDeProductos.js";
import { DetallesPedido } from "../models/index.js";
import { validarDescuento } from "../utils/findDiscount.js";
import { updateMasVendidos } from "./updateMasVendidos.js";

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

    updateMasVendidos(productos)

  } catch (error) {
    console.log("Error al crear un pedido", error.message);
  }
};
