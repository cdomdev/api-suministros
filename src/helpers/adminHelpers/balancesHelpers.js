import { User, Roles, Invitado, Pedido, DetallesPedido, Productos, } from "../../models/index.js";
import { NotFountError } from "../errorsInstances.js";

export const getListOfusers = async () => {

    const users = await getAllUsers()

    const inviteds = await getAllInviteds();

    const combinedList = [...users, ...inviteds];

    if (!combinedList) {
        throw new NotFountError('Error al listar usuarios e invitados')
    }

    return combinedList.length;

};


export const getAllorders = async () => {
    const ordersWithDetails = await Pedido.findAll({
        include: [
            {
                model: DetallesPedido,
                as: "detalles_pedido",
            },
        ],
    });

    if (!ordersWithDetails) {
        throw new NotFountError('Error al listar los pedidos en balances')
    }

    const detalles = ordersWithDetails;

    return detalles

};


export const salledsProducts = async () => {

    const products = await Productos.findAll({
        order: [["sales_count", "DESC"]],
        limit: 5,
    });

    if (!products) {
        throw new NotFountError('Error al listar los productos mas vendidos')
    }

    return products

};


export const sales = async () => {
    const users = await getAllUsers();
    const invited = await getAllInviteds();

    const ventasUsuarios = await listUsersWithOrders(users, "usuario_id");
    const ventasInvitados = await listUsersWithOrders(invited, "invitado_id");

    if (!ventasInvitados || !ventasInvitados) {
        throw new NotFountError('Error al listar las ventas por mes')
    }

    const ventas = [...ventasUsuarios.flat(), ...ventasInvitados.flat()];

    return ventas

};


const getAllUsers = async () => {
    const usuarios = await User.findAll({
        attributes: ["id", "nombre", "email", "picture"],
        include: [
            {
                model: Roles,
                as: "roles",
            },
        ],
    });
    if (!usuarios) {
        throw new NotFountError('Error al listar los usuarios')
    }

    return usuarios || [];
};


const getAllInviteds = async () => {
    const invitados = await Invitado.findAll({
        attributes: ["id", "nombre", "email"],
    });
    if (!invitados) {
        throw new NotFountError('Error al listar los invitados')
    }

    return invitados || [];
};


const listUsersWithOrders = async (users, conditionKey) => {
    const usersWithOrders = await Promise.all(
        users.map(async (user) => {
            const pedidos = await Pedido.findAll({
                where: { [conditionKey]: user.id },
                attributes: ["id", "pago_total"],
                include: [
                    {
                        model: DetallesPedido,
                        as: "detalles_pedido",
                        attributes: ["id", "createdAt"],
                    },
                ],
            });

            if (pedidos.length > 0) {
                return {
                    ...user.toJSON(),
                    pedidos,
                };
            }
            return null;
        })
    );

    return usersWithOrders.filter((user) => user !== null);
};
