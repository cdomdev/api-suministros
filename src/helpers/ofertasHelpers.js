import { Pedido, DetallesPedido, Productos, Ofertas } from "../models/index.js"
import { NotFountError } from "./errorsInstances.js";
import { Op } from "sequelize";


export const getPedidosUser = async (id) => {

    try {
        const pedidos = await Pedido.findAll({
            where: { usuario_id: id },
            attributes: ["id", "costo_de_envio", "pago_total", "estado_pedido",],
            include: [
                {
                    model: DetallesPedido,
                    as: "detalles_pedido",
                    attributes: [
                        "id",
                        "precio_unitario",
                        "sub_total",
                        "cantidad",
                        "descuento"
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
            throw new NotFountError("El usuario no tiene pedidos");
        }
    } catch (error) {
        throw error;

    }


}


export const getproductOfOferts = async() =>{
    try {
        const ofertas = await Productos.findAll({
            where: {
              discount: {
                [Op.ne]: null,
                [Op.gt]: 0,
              },
            },
            
            attributes: [
              "id",
              "marca",
              "nombre",
              "valor",
              "description",
              "image",
              "referencia",
              "discount",
            ],
          });
      
          if (!ofertas || ofertas.length === 0) {
            throw new NotFountError("No hay productos en las ofertas");
          }
      
          return ofertas
    } catch (error) {
        throw error
    }
}