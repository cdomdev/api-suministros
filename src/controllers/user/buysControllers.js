import { conecction } from "../../../database/conecction.js";
import { ErrorServer, MissingDataError, NotFountError } from '../../helpers/errorsInstances.js'
import { createOrderinvited, createOrderUser } from "../../helpers/userHelpers/ordersHelpers.js";

export const finalizarCompraInvitado = async (req, res) => {
  const t = await conecction.transaction();
  const { productos, datos, valorDeEnvio } = req.body;

  try {

    await createOrderinvited(productos, datos, valorDeEnvio, t)

    await t.commit();

    return res.status(200).json({ message: "Compra realizada con exito" });

  } catch (error) {
    console.log('Error en el proceso de pago del usuario invitado' + error)
    await t.rollback();
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error("Error en el controlador de finalizar compra invitado:", error);
      return res.status(500).json({ error: new ErrorServer().message });
    }

  }
};

export const finalizarCompraUsuario = async (req, res) => {
  const t = await conecction.transaction();
  const { productos, datos, valorDeEnvio } = req.body;

  try {

    await createOrderUser(productos, datos, valorDeEnvio, t)

    await t.commit();

    return res.status(200).json({ message: "Compra realizada con éxito" });

  } catch (error) {
    console.error("Error en el controlador de finalizar compra usuario:", error);
    await t.rollback();
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};
