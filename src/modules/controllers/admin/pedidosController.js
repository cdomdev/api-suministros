import {
  Pedido,
  DetallesPedido,
  Productos,
} from "../../models/inventaryModel.js";
import { Op } from "sequelize";
import { Invitado, Roles, User } from "../../models/usersModels.js";

export const listarPedidos = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Acceso no autorizado" });
    }

    const usuariosConPedidos = await listarPedidosUsuarios();
    const invitadosConPedidos = await listarPedidosInvitados();

    // lista usuario e invitados con pedidos

    const listaPedidos = [...usuariosConPedidos, ...invitadosConPedidos];

    // Enviar la lista de usuarios con el indicador de pedidos en la respuesta
    res.status(200).json({ listaPedidos: listaPedidos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener usuarios con pedidos" });
  }
};

export const listarPedidosUsuarios = async () => {
  try {
    // Obtener todos los usuarios
    const usuarios = await User.findAll({
      attributes: ["id", "name", "email", "telefono", "direccion", "detalles"],
      include: [
        {
          model: Roles,
          as: "roles",
        },
      ],
    });

    // Obtener el número de pedidos para cada usuario y agregar el indicador a la respuesta
    const usuariosConPedidos = await Promise.all(
      usuarios.map(async (usuario) => {
        const numPedidos = await Pedido.count({
          where: { usuario_id: usuario.id },
          include: [
            {
              model: DetallesPedido,
              as: "detalles_pedido",
            },
          ],
        });

        // Agregar un indicador al usuario para mostrar si tiene pedidos o no
        return { ...usuario.toJSON(), tienePedidos: numPedidos > 0 };
      })
    );

    // Enviar la lista de usuarios con el indicador de pedidos en la respuesta
    return usuariosConPedidos;
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Error al obtener usuarios con pedidos" });
  }
};

export const listarPedidosInvitados = async () => {
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
          include: [
            {
              model: DetallesPedido,
              as: "detalles_pedido",
            },
          ],
        });

        // Agregar un indicador al usuario para mostrar si tiene pedidos o no
        return { ...invitado.toJSON(), tienePedidos: numPedidos > 0 };
      })
    );

    // asignar rol para listado en cliente

    const invitadosConPedidosMasRole = invitadosConPedidos.map((invitado) => ({
      ...invitado,
      role: "invitado",
    }));

    // Enviar la lista de usuarios con el indicador de pedidos en la respuesta
    return invitadosConPedidosMasRole;
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Error al obtener usuarios con pedidos" });
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

    // // Filtrar los detalles de pedido con estado "entregado"
    // const pedidosFiltrados = pedidos.map((pedido) => {
    //   const detallesFiltrados = pedido.detalles_pedido.filter(
    //     (detalle) => detalle.estado_pedido !== "entregado"
    //   );
    //   return {
    //     ...pedido.toJSON(),
    //     detalles_pedido: detallesFiltrados,
    //   };
    // });

    // // Excluir pedidos que no tienen detalles después del filtrado
    // const pedidosConDetalles = pedidosFiltrados.filter(
    //   (pedido) => pedido.detalles_pedido.length > 0
    // );

    if (pedidos.length === 0) {
      res.status(404).json({ message: "El usuario no tiene pedidos" });
    } else {
      res.status(200).json({ pedidos: pedidos });
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
      where: {
        invitado_id: id,
      },
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

    // // Filtrar los detalles de pedido con estado "entregado"
    // const pedidosFiltrados = pedidos.map((pedido) => {
    //   const detallesFiltrados = pedido.detalles_pedido.filter(
    //     (detalle) => detalle.estado_pedido !== "entregado"
    //   );
    //   return {
    //     ...pedido.toJSON(),
    //     detalles_pedido: detallesFiltrados,
    //   };
    // });

    // // Excluir pedidos que no tienen detalles después del filtrado
    // const pedidosConDetalles = pedidosFiltrados.filter(
    //   (pedido) => pedido.detalles_pedido.length > 0
    // );

    if (pedidos.length === 0) {
      res.status(404).json({ message: "El usuario no tiene pedidos" });
    } else {
      res.status(200).json({ pedidos: pedidosConDetalles });
    }
  } catch (e) {
    res.status(500).json({ message: "Error en el servidor", e });
    console.log(e);
  }
};

export const updateStateOrders = async (req, res) => {
  const { estado, id } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Acceso no autorizado" });
    }

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
