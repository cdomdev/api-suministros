import {
  Pedido,
  DetallesPedido,
  Productos,
} from "../../models/inventaryModel.js";
import { Invitado, User } from "../../models/usersModels.js";

export const listarUsuariosConPedidos = async (req, res) => {
  try {
    // Obtener todos los usuarios
    const usuarios = await User.findAll({
      attributes: ["id", "name", "email", "telefono", "direccion", "detalles"],
    });

    // Obtener el número de pedidos para cada usuario y agregar el indicador a la respuesta
    const usuariosConPedidos = await Promise.all(
      usuarios.map(async (usuario) => {
        const numPedidos = await Pedido.count({
          where: { usuario_id: usuario.id },
        });

        // Agregar un indicador al usuario para mostrar si tiene pedidos o no
        return { ...usuario.toJSON(), tienePedidos: numPedidos > 0 };
      })
    );

    // Enviar la lista de usuarios con el indicador de pedidos en la respuesta
    res.json({ usuarios: usuariosConPedidos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener usuarios con pedidos" });
  }
};

export const listarInvitadosConPedidos = async (req, res) => {
  try {
    // Obtener todos los usuarios
    const invitados = await Invitado.findAll({
      attributes: [
        "id",
        "nombre",
        "email",
        "telefono",
        "direccion",
        "detalles",
      ],
    });

    // Obtener el número de pedidos para cada usuario y agregar el indicador a la respuesta
    const invitadosConPedidos = await Promise.all(
      invitados.map(async (invitado) => {
        const numPedidos = await Pedido.count({
          where: { invitado_id: invitado.id },
        });

        // Agregar un indicador al usuario para mostrar si tiene pedidos o no
        return { ...invitado.toJSON(), tienePedidos: numPedidos > 0 };
      })
    );

    // Enviar la lista de usuarios con el indicador de pedidos en la respuesta
    res.json({ invitados: invitadosConPedidos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener usuarios con pedidos" });
  }
};

export const listarPedidoPorUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const pedidos = await Pedido.findAll({
      where: { usuario_id: id },
      attributes: ["id"],
      include: [
        {
          model: DetallesPedido,
          as: "detalles_pedido",
          attributes: [
            "id",
            "precio_unitario",
            "sub_total",
            "cantidad",
            "total_pago",
            "metodo_pago",
            "descuento",
            "estado_pedido",
            "descuento",
            "costo_de_envio",
            "status_detail",
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

    if (!pedidos || pedidos.length === 0) {
      res.status(404).json({ message: "El usuario no tiene pedidos" });
    } else {
      res.status(200).json({ pedidos });
    }
  } catch (error) {
    console.log("error al listar los pedidos del usuario", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const listarPedidoPorInvitado = async (req, res) => {
  const { id } = req.params;

  try {
    const pedidos = await Pedido.findAll({
      where: { invitado_id: id },
      attributes: ["id"],
      include: [
        {
          model: DetallesPedido,
          as: "detalles_pedido",
          attributes: [
            "id",
            "precio_unitario",
            "sub_total",
            "cantidad",
            "total_pago",
            "metodo_pago",
            "descuento",
            "estado_pedido",
            "descuento",
            "costo_de_envio",
            "status_detail",
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

    if (pedidos.length === 0 || !pedidos) {
      res.status(404).json({ message: "El usuario no tiene pedidos" });
    } else {
      res.status(200).json({ pedidos });
    }
  } catch (e) {
    res.status(500).json({ message: "Error en el servidor", e });
    console.log(e);
  }
};

export const updateStateOrders = async (req, res) => {
  const { estado, id } = req.body;

  console.log(estado);
  console.log(id);
  try {
    if (!estado || !id) {
      return res
        .status(400)
        .json({ message: "faltan datos para actulizar el estado" });
    }

    const updatedRows = await DetallesPedido.update(
      { estado_pedido: estado },
      { where: { pedido_id: id } }
    );

    if (updatedRows[0] === 1) {
      console.log(updatedRows);
      res.status(200).json({ message: "Estado actilizado con exito" });
    } else {
      console.log("Error al actulizar el estado del pedido");
      res.status(404).json({ message: "Error al actulizar el estado" });
    }
  } catch (e) {
    console.log("Error con la solcitud", e);
    res.status(500).json({ message: "Error interno del servidor", e });
  }
};
