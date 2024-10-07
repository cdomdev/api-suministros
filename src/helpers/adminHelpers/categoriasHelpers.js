import { generarCodigoDesdeNombre } from "../../utils/generateCodigo.js"
import { MissingDataError, NotFountError } from "../errorsInstances.js"
import { Categorias } from "../../models/index.js"

export const newCategory = async (nombre) => {
        if (!nombre) {
            throw new MissingDataError('El nombre de la categoria es requerido')
        }


        const codigo = generarCodigoDesdeNombre(nombre)


        if (!codigo) {
            throw new NotFountError('Hubo un error al general el codido para la categoria')
        }

        const categoria = await Categorias.create({
            nombre,
            codigo
        })
        if (!categoria) {
            throw new NotFountError('Hubo un error al crear la categoria')
        }

        const categorias = await getAllCategories()

        return categorias
}

export const getAllCategories = async () => {

        const categorias = await Categorias.findAll(
            { attributes: ["id", "nombre"], });

        if (!categorias) {
            throw new NotFountError('Hubo un error al obtener las categorias')
        }

        return categorias

}

export const getCategories = async () => {
        const categorias = await getAllCategories()
        return categorias
}

export const deleteCategoryBy = async (id) => {
        if (!id) throw new MissingDataError('El id de la categoria es requerido')

        const categoria = await Categorias.destroy({
            where: { id: id },
        });

        if (!categoria) {
            throw new NotFountError('Hubo un error al eliminar la categoria')
        }

        const categorias = await getAllCategories()

        return categorias

}