import { DetallesPedido, Pedido, Productos } from "../../models/index.js";
import { NotFountError, MissingDataError } from "../errorsInstances.js";


export const getPedidosUser = async (id) => {

    if (!id) {
        throw new MissingDataError("El id del usuario es requerido");
    }

    const pedidos = await Pedido.findAll({
        where: { usuario_id: id },
        attributes: ["id", "costo_de_envio", "pago_total", "estado_pedido",],
        include: [
            {
                model: DetallesPedido,
                as: "detalles_pedido",
                attributes: [
                    "id",
                    "precio_unitario",
                    "sub_total",
                    "cantidad",
                    "descuento"
                ],
                include: [
                    {
                        model: Productos,
                        attributes: ["id", "nombre", "image", "referencia", "valor"],
                    },
                ],
            },
        ],
    });

    if (!pedidos || pedidos.length === 0) {
        throw new NotFountError("El usuario no tiene pedidos");
    }


}