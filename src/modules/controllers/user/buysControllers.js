import { User, Invitado, Roles } from "../../models/usersModels.js";
import { sendMailsCompra } from "../../../../functions/sendMailsCompra.js";
import { conecction } from "../../../database/conecction.js";
import { Pedido, Productos } from "../../models/inventaryModel.js";
import { createDetailsOrders } from "../../utils/createDetailsOrdes.js";
import { createNotifications } from "../../utils/notifications.js";

// controladores de compras usuarios - invitados

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

    // crear el nuevo invitado
    const { nombre, apellidos, email, direccion, telefono, detalles } =
      dataUser;

    const usuarioInvitado = await Invitado.create({
      nombre: nombre,
      apellidos: apellidos,
      direccion: direccion,
      telefono: telefono,
      email: email,
      detalles: detalles,
    });

    // validacion de la creacion de ususaio invitado
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
    let user = await User.findOne({ where: { email: dataUser.email } });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar datos del usuario si se proporcionan
    if (dataUser.telefono || dataUser.direccion || dataUser.detalles) {
      await User.update(
        {
          telefono: dataUser.telefono || user.telefono,
          direccion: dataUser.direccion || user.direccion,
          detalles: dataUser.detalles || user.detalles,
        },
        { where: { email: dataUser.email } }
      );
    }

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

    // crear detalles del pedido

    const detalles = await createDetailsOrders(
      dataProducts,
      valorEnvio,
      metodoPago,
      nuevoPedido
    );

    for (const producto of detalles) {
      await Productos.update(
        { sales_count: producto.sales_count + 1 },
        { where: { id: producto.id }, transaction: t }
      );
    }
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
