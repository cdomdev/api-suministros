import {
  Roles,
  User,
  Invitado,
  Pedido,
  DetallesPedido,
  Productos,
} from "../../models/index.js";

export const balances = async (req, res) => {
  try {
    // Listar todos los usuarios e invitados de las respectivas tablas
    const totalUsers = await usersList();

    // Listar pedidos de sus respectivas tablas
    const { totalOrders, detalles } = await ordersList();

    // calcular el total vendido
    const totalVendido = calcularTotalVendido(detalles);

    // calcular total de pedidos pendientes por envio
    const totalPending = PendingOrder(detalles);

    // calcular pedidos enviados

    const totolShipped = ordersShipped(detalles);

    res.status(200).json({
      users: totalUsers,
      totalOrders,
      totalSales: totalVendido,
      totalPending: totalPending.length,
      totalShipped: totolShipped.length,
    });
  } catch (error) {
    console.log(error);
  }
};

export const usersList = async () => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Roles,
          as: "roles",
        },
      ],
    });
    const inviteds = await Invitado.findAll();

    const combinedList = [...users, ...inviteds];

    return combinedList.length;
  } catch (error) {
    console.log("Error al listar usuarios e invitados", error);
  }
};

export const ordersList = async () => {
  try {
    const ordersWithDetails = await Pedido.findAll({
      include: [
        {
          model: DetallesPedido,
          as: "detalles_pedido",
        },
      ],
    });

    const totalOrders = ordersWithDetails.length;
    const detalles = ordersWithDetails;

    return {
      totalOrders,
      detalles,
    };
  } catch (error) {
    console.log("Error al listar los pedidos en balances", error);
    throw error;
  }
};

export const calcularTotalVendido = (ordersWithDetails) => {
  try {
    let totalSales = 0;
    for (const order of ordersWithDetails) {
      totalSales += parseFloat(order.pago_total);
    }
    return totalSales;
  } catch (error) {
    console.log("Error al calcular el total vendido", error);
  }
};

export const PendingOrder = (ordersList) => {
  try {
    let totalPending = [];
    for (const order of ordersList) {
      if (order.estado_pedido !== "entregado") {
        totalPending.push(order);
      }
    }
    return totalPending;
  } catch (error) {
    console.log("Error al obtener los pedidos pendientes por envios", error);
  }
};

export const ordersShipped = (ordersList) => {
  try {
    let totalShipped = [];
    for (const order of ordersList) {
      if (order.estado_pedido === "entregado") {
        totalShipped.push(order);
      }
    }
    return totalShipped;
  } catch (error) {
    console.log("Error al obtener los pedidos entregados", error);
    throw error
  }

};

export const mostSalledsProducts = async (req, res) => {
  try {

    // Obtener los productos más vendidos
    const products = await Productos.findAll({
      order: [["sales_count", "DESC"]],
      limit: 5,
    });
    // Enviar la lista de productos
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error al obtener las lista de productos mas vendidos", error);
  }
};

// listado de ventas por mes
export const salesMonth = async (req, res) => {
  try {

    const users = await listUser();
    const invited = await listInvited();

    const ventasUsuarios = await listUsersWithOrders(users, "usuario_id");
    const ventasInvitados = await listUsersWithOrders(invited, "invitado_id");


    const ventas = [...ventasUsuarios.flat(), ...ventasInvitados.flat()];

    res.status(200).json(ventas);
  } catch (error) {
    console.log("Error en el listado de ventas por mes:", error);
    res.status(500).json({ message: "Error al obtener las ventas." });
  }
};

const listUser = async () => {
  try {
    const usuarios = await User.findAll({
      attributes: ["id", "nombre", "email", "picture"],
    });

    return usuarios || [];
  } catch (e) {
    console.log("Error en el listado de usuarios", e);
  }
};

const listInvited = async () => {
  try {
    const invitados = await Invitado.findAll({
      attributes: ["id", "nombre", "email"],
    });
    return invitados || [];
  } catch (e) {
    console.log("Error en el listado de usuarios", e);
  }
};

const listUsersWithOrders = async (users, conditionKey) => {
  const usersWithOrders = await Promise.all(
    users.map(async (user) => {
      const pedidos = await Pedido.findAll({
        where: { [conditionKey]: user.id },
        attributes: ["id", "pago_total"],
        include: [
          {
            model: DetallesPedido,
            as: "detalles_pedido",
            attributes: ["id", "createdAt"],
          },
        ],
      });

      // Solo devuelve el usuario si tiene pedidos
      if (pedidos.length > 0) {
        return {
          ...user.toJSON(),
          pedidos,
        };
      }
      // Retorna null si no tiene pedidos
      return null;
    })
  );

  // Filtra los resultados para eliminar los valores null
  return usersWithOrders.filter((user) => user !== null);
};
