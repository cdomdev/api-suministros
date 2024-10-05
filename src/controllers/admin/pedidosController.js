import { getAllPedidos, getOrderInvitedBy, getOrderUserBy, updateStateBy } from "../../helpers/adminHelpers/pedidoHelpers.js";
import { MissingDataError, NotFountError, ErrorServer } from "../../helpers/errorsInstances.js";


export const listarPedidos = async (req, res) => {

  try {

    const listaPedidos = await getAllPedidos()

    res.status(200).json({ listaPedidos: listaPedidos });

  } catch (error) {
    console.log("Error al obtener usuarios con pedidos", error);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};


export const listarPedidoPorUsuario = async (req, res) => {
  const { id } = req.params;
  try {

    const pedidos = await getOrderUserBy(id)

    res.status(200).json({ pedidos });
  } catch (error) {
    console.log("Error al listar los pedidos del usuario", error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};


export const listarPedidoPorInvitado = async (req, res) => {
  const { id } = req.params;

  try {

    const pedidos = await getOrderInvitedBy(id)

    res.status(200).json({ pedidos });

  } catch (error) {
    console.log("Error al listar los pedidos del usuario", error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};


export const updateStateOrders = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {

    await updateStateBy(id, estado)

    res.status(200).json({ estado, message: "Estado actilizado con exito" });
  } catch (error) {
    console.log("Error al intentar actulizar el estado del pedido", error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};
