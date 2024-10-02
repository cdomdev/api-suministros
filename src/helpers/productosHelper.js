import { Productos, Subcategorias } from "../models/index.js";
import { NotFountError } from "./errorsInstances.js";
import Sequelize from "sequelize";

export const getProducts = async () => {
    try {
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
    } catch (error) {
        throw error
    }
}

export const findProducts = async (query) => {
    try {

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

    } catch (error) {
        throw error
    }
}


export const getMoreSalled = async () => {
    try {


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
    } catch (error) {
        throw error
    }
}

export const getProductBy = async (id) => {
    try {

        const producto = await Productos.findOne({
            where: { id: id }
        });

        if (!producto) {
            throw new NotFountError("Producto no encontrado");
        }

        return producto

    } catch (error) {
        throw error
    }
}
