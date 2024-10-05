import { MissingDataError, NotFountError } from "../errorsInstances.js"
import { Productos, Inventario } from "../../models/index.js";

export const saveProducto = async (listaProductos) => {
    try {

        if (!listaProductos) {
            throw new MissingDataError('Faltan datos para crear un nuevo producto')
        }

        const productos = listaProductos.map(producto => ({
            id: producto.id,
            marca: producto.marca,
            nombre: producto.nombre,
            valor: producto.valor,
            description: producto.description,
            referencia: producto.referencia,
            categoria_id: parseInt(producto.categoria_id),
            subcategoria_id: parseInt(producto.subcategoria_id),
            image: producto.image,
        }))

        const saveData = await Productos.bulkCreate(productos, { returning: true })

        if (!saveData) {
            throw new NotFountError('Algo salio mal crear nuevos productos')
        }

        const inventario = saveData.map((productosGuardados, index) => ({
            producto_Id: productosGuardados.id,
            cantidad: productosGuardados[index].cantidad,
        }))

        await Inventario.bulkCreate(inventario)

    } catch (error) {
        throw error
    }
}