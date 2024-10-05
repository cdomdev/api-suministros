import { MissingDataError, NotFountError } from "../errorsInstances.js"
import { generarCodigoDesdeNombre } from "../../utils/generateCodigo.js";
import { Subcategorias } from "../../models/index.js";

export const createSubcategory = async (nombre) => {
    try {

        if (!nombre) {
            throw new MissingDataError('Faltan datos, se requiere de un nombre para crear una nueva subcategoria')
        }

        const codigo = generarCodigoDesdeNombre(nombre);

        const nuevaCatgoria = await Subcategorias.create({ nombre, codigo });

        if (!nuevaCatgoria) {
            throw new NotFountError('Algo salio mal, no se pudo crear la nueva categoria')
        }

        const subcategories = await getAllSubcategies()

        return subcategories
    } catch (error) {
        throw error
    }

}

export const getAllSubcategies = async () => {
    try {
        const subcategories = await Subcategorias.findAll()
        if (!subcategories) {
            throw new NotFountError('Algo salio mal, hubo un error al listar las subcatetgoria')
        }
        return subcategories
    } catch (error) {
        throw error
    }
}

export const deletSubcategoria = async (id) => {
    try {
        if (!id) throw new MissingDataError('Faltan datos, se requiere del id del producto a elimnar')

        const del = await Subcategorias.destroy({ where: { id: id } });

        if (del === 0) throw new NotFountError('Algo salio mal, hubo un error al intentar elimnar una subcategoria')
        const subcategirias = await getAllSubcategies()
        return subcategirias
    } catch (error) {
        throw error
    }
}