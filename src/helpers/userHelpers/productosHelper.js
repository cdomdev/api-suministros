import { Productos, Subcategorias } from "../../models/index.js";
import { NotFountError } from "../errorsInstances.js";
import Sequelize from "sequelize";

export const getProducts = async () => {
    const productos = await Productos.findAll({
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
        include: [
            {
                model: Subcategorias,
                attributes: ["id", "nombre"],
            },
        ],
    });

    return productos
}

export const findProducts = async (query) => {
    let productos = await Productos.findAll({
        where: {
            nombre: Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("nombre")),
                "LIKE",
                `%${query.toLowerCase()}%`
            ),
        },
    })


    if (!productos && productos.length === 0) {
        throw new NotFountError("No se encontraron productos para la búsqueda proporcionada")
    }


    return productos
}


export const getMoreSalled = async () => {

    const products = await Productos.findAll({
        order: [["sales_count", "DESC"]],
        limit: 4,
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

    return products
}

export const getProductBy = async (id) => {
    const producto = await Productos.findOne({
        where: { id: id }
    });

    if (!producto) {
        throw new NotFountError("Producto no encontrado");
    }

    return producto
}
