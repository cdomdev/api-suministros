import { Productos } from "../../models/index.js"
import { NotFountError } from "../errorsInstances.js";
import { Op } from "sequelize";

export const getproductOfOferts = async () => {
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
}