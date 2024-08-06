import { DetallesPedido } from "../models/detallesPedido.js";

// actualizar datos del pedido
export const updateDetallesPedido = async (status_detail, id, pedidoId) => {
  try {
    const [affectedRows] = await DetallesPedido.update(
      {
        status_detail: status_detail,
        order_id: id,
      },
      {
        where: { pedido_id: pedidoId },
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
