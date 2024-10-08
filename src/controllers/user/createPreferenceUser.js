import { findUser } from "../../helpers/userHelpers/findUser.js";
import { createOrderMercadopagoUser } from "../../helpers/userHelpers/ordersHelpers.js";
import { createMercadoPagoPreferenceUser, createItemsMercadoPago } from "../../helpers/userHelpers/mercadoPagoHelper.js";
import { ErrorServer, MissingDataError, NotFountError } from '../../helpers/errorsInstances.js'


export const createPreferenceUser = async (req, res) => {
  const { productos, datos, valorDeEnvio } = req.body;
  const t = await conecction.transaction();

  try {

    const user = await findUser(datos);

    const nuevoPedido = await createOrderMercadopagoUser(user.id, productos, valorDeEnvio)

    const mercadoPagoItems = createItemsMercadoPago(productos, valorDeEnvio);

    const preferenceMercadopago = await createMercadoPagoPreferenceUser(mercadoPagoItems, nuevoPedido.id, user, productos, valorDeEnvio);

    await t.commit();


    res.status(200).json({
      id: preferenceMercadopago.id,
      init_point: preferenceMercadopago.init_point,
      message: "success",
    });

  } catch (error) {
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
