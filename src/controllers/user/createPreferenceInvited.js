import { findOrCreateInvited } from "../../helpers/userHelpers/invitadoHelper.js";
import { createMercadoPagoPreferenceInvited, createItemsMercadoPago } from "../../helpers/userHelpers/mercadoPagoHelper.js";
import { createOrderMercadopagoInvited } from '../../helpers/userHelpers/ordersHelpers.js'
import { ErrorServer, MissingDataError, NotFountError } from '../../helpers/errorsInstances.js'

export const createPreferenceInvited = async (req, res) => {
  const { productos, datos, valorDeEnvio } = req.body;
  const t = await conecction.transaction();
  try {

    if (!productos || !datos || !valorDeEnvio) {
      throw new MissingDataError("Faltan datos para procesar el pago");
    }

    const user = await findOrCreateInvited(datos);

    const nuevoPedido = await createOrderMercadopagoInvited(user.id, productos, valorDeEnvio);

    const mercadoPagoItems = await createItemsMercadoPago(productos, valorDeEnvio);

    const preferenceMercadopago = await createMercadoPagoPreferenceInvited(mercadoPagoItems, nuevoPedido.id, user, productos, valorDeEnvio);

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
