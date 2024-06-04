import { Invitado, User } from "../../models/usersModels.js";
import { sendMailsCompra } from "../../../../functions/sendMailsCompra.js";
import { conecction } from "../../../database/conecction.js";
import {
  calcularCantidad,
  calcularTotal,
  subTotal,
} from "../../utils/valoresDeProductos.js";

import { Pedido, DetallesPedido } from "../../models/inventaryModel.js";

// controladores de compras usuarios - invitados

// controlador para compras invitados
export const finalizarCompraInvitado = async (req, res) => {
  try {
    const { dataProducts, dataUser, metodoPago } = req.body;

    console.log("productos en la compra", dataProducts);
    // validacion de datos
    if (!dataProducts || !dataUser) {
      return res
        .status(401)
        .json({ message: "Faltan datos para prcesar la compra" });
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
      return res.status(500).json({ message: "Error al crear el usuario" });
    }
    // crear pedido
    const nuevoPedido = await Pedido.create({
      total: calcularTotal(dataProducts),
      cantidad: calcularCantidad(dataProducts),
      metodo_pago: metodoPago,
      invitado_id: usuarioInvitado.id,
      usuario_id: null,
    });

    // validar cracion del pedido
    if (!nuevoPedido) {
      return res.status(500).json({ message: "Error al crear el pedido" });
    }

    // crear detalles del pédido
    for (const producto of dataProducts) {
      await DetallesPedido.create({
        pedido_id: nuevoPedido.id,
        producto_id: producto.id,
        cantidad: calcularCantidad(dataProducts),
        precio_unitario: producto.valor,
        sub_total: subTotal(dataProducts),
        total_pago: producto.valor,
        descuento: producto.descuento | 0,
      });
    }

    // Enviar email invitado
    sendMailsCompra(
      0,
      usuarioInvitado.nombre,
      usuarioInvitado.email,
      nuevoPedido,
      dataProducts
    );

    // enviar respuesta de la solcitud
    return res.status(200).json({ message: "Compra realzida con exito" });
  } catch (e) {
    console.log("Error al finalizar la compra", e);
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};

// controladora para compras usuario
export const finalizarCompraUsuario = async (req, res) => {
  const t = await conecction.transaction();
  try {
    const { dataProducts, dataUser, metodoPago } = req.body;
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
      total: calcularTotal(dataProducts),
      cantidad: calcularCantidad(dataProducts),
      metodo_pago: metodoPago,
      invitado_id: null,
      usuario_id: user.id,
      transaction: t,
    });

    // Validar creación del pedido
    if (!nuevoPedido) {
      return res.status(500).json({ message: "Error al crear el pedido" });
    }

    // Crear detalles del pedido
    for (const producto of dataProducts) {
      await DetallesPedido.create({
        pedido_id: nuevoPedido.id,
        producto_id: producto.id,
        cantidad: producto.cantidad,
        precio_unitario: producto.valor,
        sub_total: producto.valor * producto.cantidad,
        total_pago: producto.valor,
        descuento: producto.descuento | 0,
        transaction: t,
      });
    }

    // Enviar correo electrónico usuario
    sendMailsCompra(0, user.name, user.email, nuevoPedido, dataProducts);

    await t.commit();

    return res.status(200).json({ message: "Compra realizada con éxito" });
  } catch (error) {
    await t.rollback();
    console.error("Error al finalizar la compra", error);
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};
