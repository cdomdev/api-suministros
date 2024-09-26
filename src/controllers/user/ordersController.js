import { Pedido, DetallesPedido, Productos } from "../../models/index.js";

export const listarPedidoPorUsuario = async (req, res) => {
  const { id } = req.params;

  try {
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
      return res.status(404).json({ message: "El usuario no tiene pedidos" });
    }

    res.status(200).json({ pedidos });
  } catch (e) {
    res.status(500).json({ message: "Error en el servidor", e });
    console.log(e);
  }
};
