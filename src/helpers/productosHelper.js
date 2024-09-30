import { Productos } from "../models/index.js";
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
        });

        return productos
    } catch (error) {
        throw error
    }
}

export const findProducts = async (query) => {
    try {

        Productos.findAll({
            where: {
                nombre: Sequelize.where(
                    Sequelize.fn("LOWER", Sequelize.col("nombre")),
                    "LIKE",
                    `%${query.toLowerCase()}%`
                ),
            },
        })
            .then((resultados) => {
                if (resultados && resultados.length > 0) {
                    return resultados
                } else {
                    throw new NotFountError("No se encontraron productos para la búsqueda proporcionada")
                }
            })
            .catch((err) => {
                throw err
            });
    } catch (error) {
        throw error
    }
}


export const getMoreSalledProducts = async () => {
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


// export const buscarProductos = (req, res) => {
//     const { query } = req.body;
  
//     Productos.findAll({
//       where: {
//         nombre: Sequelize.where(
//           Sequelize.fn("LOWER", Sequelize.col("nombre")),
//           "LIKE",
//           `%${query.toLowerCase()}%`
//         ),
//       },
//     })
//       .then((resultados) => {
//         if (resultados && resultados.length > 0) {
//           return res
//             .status(200)
//             .json({ message: "Productos encontrados", resultados: resultados });
//         } else {
//           return res.status(404).json({
//             message: "No se encontraron productos para la búsqueda proporcionada",
//           });
//         }
//       })
//       .catch((err) => {
//         return res.status(500).json({
//           message: "Error en el servidor al buscar productos",
//           error: err,
//         });
//       });
//   };