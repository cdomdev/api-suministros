import {
  Pedido,
  DetallesPedido,
  Productos,
  Invitado,
  Roles,
  User,
} from "../../models/index.js";

export const listarPedidos = async (req, res) => {

  try {
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
      attributes: ["id", "nombre", "email", "telefono", "direccion", "detalles"],
      include: [
        {
          model: Roles,
          as: "roles",
        },
      ],
    });

    // Obtener el número de pedidos para cada usuario y agregar el indicador a la respuesta
    const usuariosConPedidos = await listUsersWithOrders(
      usuarios,
      "usuario_id"
    );

    // Enviar la lista de usuarios con el indicador de pedidos en la respuesta
    return usuariosConPedidos;
  } catch (error) {
    console.log(error);
    throw error
  }
};

export const listarPedidosInvitados = async () => {
  try {
    const invitados = await Invitado.findAll({
      attributes: [
        "id",
        "nombre",
        "email",
        "telefono",
        "direccion",
        "detalles",
        "ciudad",
        "departamento"
      ],
    });

    const invitadosConPedidos = await listUsersWithOrders(
      invitados,
      "invitado_id"
    );

    const invitadosConPedidosMasRole = invitadosConPedidos.map((invitado) => ({
      ...invitado,
      role: "invitado",
    }));

    return invitadosConPedidosMasRole;
  } catch (error) {
    console.log(error);
    throw error
  }
};

export const listarPedidoPorUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const pedidos = await Pedido.findAll({
      where: { usuario_id: id },
      attributes: ["id", "metodo_de_pago", "estado_pedido", "costo_de_envio", "status_mercadopago", "pago_total",],
      include: [
        {
          model: DetallesPedido,
          as: "detalles_pedido",
          attributes: [
            "id",
            "precio_unitario",
            "sub_total",
            "cantidad",
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

    if (pedidos.length === 0) {
      return res.status(404).json({ message: "El usuario no tiene pedidos" });
    }

    res.status(200).json({ pedidos });
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
      attributes: ["id", "metodo_de_pago", "estado_pedido", "costo_de_envio", "status_mercadopago", "pago_total",],
      include: [
        {
          model: DetallesPedido,
          as: "detalles_pedido",
          attributes: [
            "id",
            "precio_unitario",
            "sub_total",
            "cantidad",
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

    if (pedidos.length === 0) {
      return res.status(404).json({ message: "El usuario no tiene pedidos" });
    }

    res.status(200).json({ pedidos });
  } catch (e) {
    res.status(500).json({ message: "Error en el servidor", e });
    console.log(e);
  }
};

const listUsersWithOrders = async (users, conditionKey) => {
  return await Promise.all(
    users.map(async (user) => {
      const numPedidos = await Pedido.count({
        where: { [conditionKey]: user.id },
        include: [
          {
            model: DetallesPedido,
            as: "detalles_pedido",
          },
        ],
      });

      return { ...user.toJSON(), tienePedidos: numPedidos > 0 };
    })
  );
};

export const updateStateOrders = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  console.log(id)
  console.log(estado)
  try {
    if (!estado || !id) {
      return res
        .status(400)
        .json({ message: "faltan datos para actulizar el estado" });
    }

    const updatedRows = await Pedido.update(
      { estado_pedido: estado },
      { where: { id: id } }
    );

    if (updatedRows[0] === 1) {
      res.status(200).json({ estado, message: "Estado actilizado con exito" });
    } else {
      console.log("Error al actulizar el estado del pedido");
      res.status(404).json({ message: "Error al actulizar el estado" });
    }
  } catch (e) {
    console.log("Error con la solcitud", e);
    res.status(500).json({ message: "Error interno del servidor", e });
  }
};
