import { MissingDataError, ErrorServer, NotFountError } from '../../helpers/errorsInstances.js'
import { getPedidosUser } from "../../helpers/userHelpers/ordersUserHelper.js";

export const listarPedidoPorUsuario = async (req, res) => {
  const { id } = req.params;

  try {

    const pedidos = await getPedidosUser(id)

    res.status(200).json({ pedidos });

  } catch (error) {
    console.error("Error al listar los pedidos del usuario:", error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};
