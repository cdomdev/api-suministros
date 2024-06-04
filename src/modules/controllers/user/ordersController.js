import {
  Pedido,
  DetallesPedido,
  Productos,
} from "../../models/inventaryModel.js";
// import  { User } from "../../models/usersModels.js";

// controlador para listado de pediudos usuarios

// export const listarPedidos = async (req, res) => {
//   const { email } = req.params;
//   console.log(email)
//   try {
//     const pedidos = await Pedido.findAll({
//       include: [
//         {
//           model: DetallesPedido,
//           attributes: ["id"],
//           include: [
//             {
//               model: Productos,
//               attributes: ["id", "nombre", "image", "referencia", "valor"],
//             },
//           ],
//         },
//         {
//           model: User,
//           attributes: [],
//           where: { email: email },
//         },
//       ],
//       attributes: ["id", "cantidad", "total"],
//     });

//     res.status(200).json({ pedidos: pedidos });
//   } catch (e) {
//     console.log("Error al listar pedidos", e);
//     res.status(500).json({ message: "Error interno en el servidor" });
//   }
// };


export const listarPedidoPorUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const pedidos = await Pedido.findAll({
      where: { usuario_id: id },
      attributes: ["id", "cantidad", "metodo_pago", "total"],
      include: [
        {
          model: DetallesPedido,
          attributes: [
            "id",
            "precio_unitario",
            "sub_total",
            "descuento",
            "createdAt",
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

    if (pedidos) {
      res.status(200).json({ pedidos });
    } else {
      res.status(404).json({ message: "El usuario no tiene pedidos" });
    }
  } catch (e) {
    res.status(500).json({ message: "Error en el servidor", e });
    console.log(e);
  }
};