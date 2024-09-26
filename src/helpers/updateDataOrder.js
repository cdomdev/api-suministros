import { Pedido } from "../models/index.js";

// actualizar datos del pedido
export const updateDataPedido = async (status_detail, id, pedidoId) => {

  console.log('valor del estatus detail---> ', status_detail)
  console.log('valor del id otro   ---> ', id)
  console.log('valor del id pedido ---> ', pedidoId)
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
