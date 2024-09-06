import { sendMailsCompra } from "../../../templates/emailTemplatesJs/index.js";
import { conecction } from "../../../database/conecction.js";
import { Pedido } from "../../models/index.js";
import { createDetailsOrders } from "../../helpers/createDetailsOrdes.js";
import { createNotifications } from "../../helpers/notifications.js";
import { createNewGuest } from "../../helpers/createNewGuests.js";
import { userExisting } from "../../helpers/validateUserExisting.js";
import { updateDataUser } from "../../helpers/updateDataUser.js";

// controlador para compras invitados
export const finalizarCompraInvitado = async (req, res) => {
  try {
    const { dataProducts, dataUser, metodoPago, valorEnvio } = req.body;
    // validacion de datos
    if (!dataProducts || !dataUser) {
      return res
        .status(400)
        .json({ message: "Faltan datos para procesar la compra" });
    }

    const usuarioInvitado = await createNewGuest(dataUser);

    if (!usuarioInvitado) {
      return res.status(400).json({ message: "Error al crear el usuario" });
    }

    // crear pedido
    const nuevoPedido = await Pedido.create({
      invitado_id: usuarioInvitado.id,
      usuario_id: null,
    });

    // validar cracion del pedido
    if (!nuevoPedido) {
      return res.status(404).json({ message: "Error al crear el pedido" });
    }

    // crear detalles del pédido
    createDetailsOrders(dataProducts, valorEnvio, metodoPago, nuevoPedido);

    // Enviar email invitado
    sendMailsCompra(0, usuarioInvitado, dataProducts, valorEnvio);

    // crear la notificacion de la compra
    createNotifications(dataUser);

    // enviar respuesta de la solcitud
    return res.status(200).json({ message: "Compra realzida con exito" });
  } catch (e) {
    console.log("Error al finalizar la compra", e);
    return res.status(502).json({ message: "Error interno en el servidor" });
  }
};

// controladora para compras usuario
export const finalizarCompraUsuario = async (req, res) => {
  const t = await conecction.transaction();
  try {
    const { dataProducts, dataUser, metodoPago, valorEnvio } = req.body;
    // Validación de datos
    if (!dataProducts || !dataUser || !metodoPago) {
      return res.status(400).json({ message: "Faltan datos de la compra" });
    }

    // Validar el usuario en base de datos
    let user = await userExisting(dataUser.email);

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await updateDataUser(dataUser);

    // Crear pedido
    const nuevoPedido = await Pedido.create({
      invitado_id: null,
      usuario_id: user.id,
      transaction: t,
    });

    // Validar creación del pedido
    if (!nuevoPedido) {
      return res.status(500).json({ message: "Error al crear el pedido" });
    }

    await createDetailsOrders(
      dataProducts,
      valorEnvio,
      metodoPago,
      nuevoPedido
    );

    // crear la notificacion de la compra
    createNotifications(user);

    // Enviar correo electrónico usuario
    sendMailsCompra(0, user, dataProducts, valorEnvio);

    await t.commit();

    return res.status(200).json({ message: "Compra realizada con éxito" });
  } catch (error) {
    await t.rollback();
    console.error("Error al finalizar la compra", error);
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};
