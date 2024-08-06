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
      totalSales: totalVendido.toFixed(2),
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
      for (const detalle of order.detalles_pedido) {
        totalSales += parseFloat(detalle.total_pago);
      }
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
      for (const detalle of order.detalles_pedido) {
        if (detalle.estado_pedido !== "entregado") {
          totalPending.push(detalle);
        }
      }
    }
    return totalPending;
  } catch (error) {
    console.log("Error al obtener los pedidos pendientes por envios", error);
  }
};

export const ordersShipped = (ordersList) => {
  try {
  } catch (error) {
    console.log("Error al obtener los pedidos entregados", error);
  }
  let totalShipped = [];
  for (const order of ordersList) {
    for (const detalle of order.detalles_pedido) {
      if (detalle.estado_pedido === "entregado") {
        totalShipped.push(detalle);
      }
    }
  }
  return totalShipped;
};

// listado de productos mas vendidos

export const mostSalledsProducts = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Acceso no autorizado" });
    }

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
