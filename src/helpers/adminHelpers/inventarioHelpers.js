import { Productos, Categorias, Subcategorias, Inventario } from "../../models/index.js"
import { NotFountError, MissingDataError } from '../errorsInstances.js'


export const getAllProductoForInventary = async () => {
    const productos = await Productos.findAll({
        attributes: [
            "id",
            "nombre",
            "marca",
            "valor",
            "description",
            "image",
            "referencia",
        ],
        include: [
            {
                model: Inventario,
                attributes: ["cantidad"],
            },
            {
                model: Categorias,
                attributes: ["id", "nombre"],
            },
            {
                model: Subcategorias,
                attributes: ["id", "nombre"],
            },
        ],
    })

    if (!productos || productos.length === 0) {
        throw new NotFountError('No hay productos en inventario')
    }

    return productos
}

export const updateInventaryBy = async (id, nuevaCantidad) => {

    if (!id || !nuevaCantidad) {
        throw new MissingDataError('Faltan datos para el proceso de actualizacion')
    }

    const inventario = await Inventario.findOne({ where: { id } });

    if (inventario) {
        await Inventario.update(
            { cantidad: nuevaCantidad },
            { where: { producto_Id: id } }
        );
    }

    if (inventario === 0) {
        throw new NotFountError('Hubo un error al actulizar datos del inventario')
    }

    const productos = await getAllProductoForInventary()


    return productos

}

export const getOneProductBy = async (id) => {

    const productos = await Productos.findOne({ where: { id: id } });

    if (!productos) {
        throw new NotFountError('No se encontro el producto')
    }

    return productos

}

export const updateProductInventaryBy = async (id, nuevosDatos) => {
    const {
        nombre,
        marca,
        valor,
        description,
        referencia,
        categoria_id,
        subcategoria_id,
    } = nuevosDatos;


    if (!id || !nuevosDatos) {
        throw new MissingDataError('Faltan datos para el proceso de actualizacion')
    }

    const producto = await getOneProductBy(id)

    await Productos.update(
        {
            nombre,
            marca,
            valor,
            description,
            referencia,
            categoria_id,
            subcategoria_id,
        },
        { where: { id: id } }
    );

    if (producto === 0) {
        throw new NotFountError('Hubo en el proceso de actulizacion del producto de inventario')
    }


    const productos = await getAllProductoForInventary()

    return productos


}

export const deleteProductBy = async (id) => {

    if (!id) {
        throw new MissingDataError('El id del producto es requerido')
    }

    const productoEliminado = await Productos.destroy({
        where: { id: id },
    });

    if (!productoEliminado) {
        throw new NotFountError('Hubo un error al inetantar eliminar el producto');
    } else {
        await Inventario.destroy({
            where: { producto_Id: id },
        });
    }

    const productos = await getAllProductoForInventary()

    return productos

}