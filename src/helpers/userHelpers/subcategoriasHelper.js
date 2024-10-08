import { Subcategorias, Productos } from "../../models/index.js";
import { NotFountError } from "../errorsInstances.js";


export const getSubCategoryBy = async (codigo) => {

    const categoriasDb = await Subcategorias.findOne({
        where: { codigo: codigo },
        attributes: ["id", "nombre"],
    });

    if (!categoriasDb) {
        throw new NotFountError("Subcategoría no encontrada")
    }

    const productos = await Productos.findAll({
        where: { subcategoria_id: categoriasDb.id },
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


}
