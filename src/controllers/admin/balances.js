import { getAllorders, getListOfusers, sales, salledsProducts } from "../../helpers/adminHelpers/balancesHelpers.js";
import { NotFountError, ErrorServer } from "../../helpers/errorsInstances.js";
import { calculosDeBalances } from "../../utils/calculosEnBalances.js";

export const balances = async (req, res) => {
  try {

    const [totalUsers, detalles] = await Promise.all([
      getListOfusers(),
      getAllorders(),
    ]);

    const { totalPending, totalShipped, totalVendido } = calculosDeBalances(detalles)

    res.status(200).json({
      users: totalUsers,
      totalOrders: detalles.length,
      totalSales: totalVendido,
      totalPending: totalPending.length,
      totalShipped: totalShipped.length,
    });

  } catch (error) {
    console.log('Error en el proceso de listado de los balance', error)
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ error: new ErrorServer().message });
  }
};


export const mostSalledsProducts = async (req, res) => {
  try {

    const products = await salledsProducts()

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error al obtener las lista de productos mas vendidos", error);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};


export const salesMonth = async (req, res) => {
  try {

    const ventas = await sales()

    res.status(200).json(ventas);
  } catch (error) {
    console.log("Error en el listado de ventas por mes:", error);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};

