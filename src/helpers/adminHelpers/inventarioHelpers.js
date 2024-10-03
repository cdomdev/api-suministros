import { Productos, Categorias, Subcategorias, Inventario } from "../../models/index.js"
import { NotFountError } from '../errorsInstances.js'


export const getAllProductoForInventary = async () => {
    try {
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

    } catch (error) {
        throw error
    }
}

export const updateInventaryBy = async (id, nuevaCantidad) => {
    try {

        const inventario = await Inventario.findOne({ where: { id } });

        if (inventario) {
            await Inventario.update(
                { cantidad: nuevaCantidad },
                { where: { producto_Id: id } }
            );
        }

        if (inventario ===  0) {
            throw new NotFountError('Hubo un error al actulizar datos del inventario')
        }

        const productos = await getAllProductoForInventary()


        return productos

    } catch (error) {
        throw error
    }
}

export const getOneProductBy = async (id) => {
    try {
        const productos = await Productos.findOne({ where: { id: id } });

        if (!productos) {
            throw new NotFountError('No se encontro el producto')
        }

        return productos
    } catch (error) {
        throw error
    }
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


    try {

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

    } catch (error) {
        throw error
    }
}

export const deleteProductBy = async (id) => {
    try {

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

    } catch (error) {
        throw error
    }
}