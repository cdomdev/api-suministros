import { User, Invitado, Roles, DetallesPedido, Pedido, Productos } from "../../models/index.js";
import { NotFountError, MissingDataError } from '../errorsInstances.js'

export const getAllUsers = async () => {
    try {
        const users = User.findAll({
            attributes:
                [
                    "id",
                    "nombre",
                    "email",
                    "telefono",
                    "direccion",
                    "detalles",
                    "ciudad",
                    "departamento"
                ],
            include: [
                {
                    model: Roles,
                    as: "roles",
                },
            ],
        });

        if (!users) {
            throw new NotFountError('Hubo un error al listar todos los usuarios')
        }

        return users
    } catch (error) {
        throw error
    }
}
// funcion reutilizable en los helpers de getAllUserWhithOrder y getAllInvitedsWithOrders 
// para el lisatdo de pedidos mas indicador

const listUsersWithOrders = async (users, conditionKey) => {
    return await Promise.all(
        users.map(async (user) => {
            const numPedidos = await Pedido.count({
                where: { [conditionKey]: user.id },
                include: [
                    {
                        model: DetallesPedido,
                        as: "detalles_pedido",
                    },
                ],
            });

            return { ...user.toJSON(), tienePedidos: numPedidos > 0 };
        })
    );
};

export const getAllInvited = async () => {
    try {
        const invitados = await Invitado.findAll({
            attributes:
                [
                    "id",
                    "nombre",
                    "email",
                    "telefono",
                    "direccion",
                    "detalles",
                    "ciudad",
                    "departamento"
                ],
        });

        if (!invitados) {
            throw new NotFountError('Hubo un error al listar todos los invitados')
        }

        return invitados
    } catch (error) {
        throw error
    }
}

export const getAllUserWithOrders = async () => {
    try {

        const usuarios = await getAllUsers()

        const usuariosConPedidos = await listUsersWithOrders(
            usuarios,
            "usuario_id"
        );

        return usuariosConPedidos;
    } catch (error) {
        throw error
    }
}

export const getAllInvitedsWithOrders = async () => {
    try {

        const invitados = await getAllInvited()

        const invitadosConPedidos = await listUsersWithOrders(
            invitados,
            "invitado_id"
        );

        const invitadosConPedidosMasRole = invitadosConPedidos.map((invitado) => ({
            ...invitado,
            role: "invitado",
        }));

        return invitadosConPedidosMasRole;
    } catch (error) {
        throw error
    }
}

export const getAllPedidos = async () => {
    try {

        const usuariosConPedidos = await getAllUserWithOrders();
        const invitadosConPedidos = await getAllInvitedsWithOrders();

        const listaPedidos = [...usuariosConPedidos, ...invitadosConPedidos];

        return listaPedidos
    } catch (error) {
        throw error
    }

}


export const getOrderUserBy = async (id) => {
    try {

        if (!id) {
            throw new MissingDataError('Se require el id del usuario para listar los pedidos')
        }

        const pedidos = await Pedido.findAll({
            where: { usuario_id: id },
            attributes: ["id", "metodo_de_pago", "estado_pedido", "costo_de_envio", "status_mercadopago", "pago_total",],
            include: [
                {
                    model: DetallesPedido,
                    as: "detalles_pedido",
                    attributes: [
                        "id",
                        "precio_unitario",
                        "sub_total",
                        "cantidad",
                        "descuento",
                        "createdAt",
                    ],
                    include: [
                        {
                            model: Productos,
                            attributes: ["id", "nombre", "image", "referencia", "valor"],
                        },
                    ],
                },
            ],
        });

        if (!pedidos || pedidos.length === 0) {
            throw new NotFountError('El usuario no tienes pedidos')
        }

        return pedidos

    } catch (error) {
        throw error
    }
}


export const updateStateBy = async (id, estado) => {
    try {

        if (!estado || !id) {
            throw new MissingDataError('Faltan datos para actulizar el estado del pedido')
        }


        const updatedRows = await Pedido.update(
            { estado_pedido: estado },
            { where: { id: id } }
        );

        if (updatedRows === 0) {
            throw new NotFountError('Algo salio mal, no se pudo actulzar el estado del pedido')
        }

    } catch (error) {
        throw error
    }
}


export const getOrderInvitedBy = async (id) => {
    try {

        if (!id) {
            throw new MissingDataError('Se require el id del usuario para listar los pedidos')
        }

        const pedidos = await Pedido.findAll({
            where: { invitado_id: id },
            attributes: ["id", "metodo_de_pago", "estado_pedido", "costo_de_envio", "status_mercadopago", "pago_total",],
            include: [
                {
                    model: DetallesPedido,
                    as: "detalles_pedido",
                    attributes: [
                        "id",
                        "precio_unitario",
                        "sub_total",
                        "cantidad",
                        "descuento",
                        "createdAt",
                    ],
                    include: [
                        {
                            model: Productos,
                            attributes: ["id", "nombre", "image", "referencia", "valor"],
                        },
                    ],
                },
            ],
        });

        if (!pedidos || pedidos.length === 0) {
            throw new NotFountError('El usuario no tienes pedidos')
        }

        return pedidos
    } catch (error) {
        throw error
    }
}
