import { deleteProductBy, getAllProductoForInventary, updateInventaryBy, updateProductInventaryBy } from "../../helpers/adminHelpers/inventarioHelpers.js";
import { ErrorServer, NotFountError, MissingDataError } from '../../helpers/errorsInstances.js'


export const listarProductos = async (req, res) => {
  try {

    const productos = await getAllProductoForInventary()

    res.status(200).json({ productos });
  } catch (e) {
    console.log('Error al obtener los productos de inventario', e);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};


export const actulizarStock = async (req, res) => {
  const { newStock } = req.body;
  const { id: producto_Id } = req.params;
  try {

    if (!newStock || !producto_Id) {
      throw new MissingDataError('Faltan datos para el proceso de actualizacion')
    }


    const inventaryUpdate = await updateInventaryBy(id, newStock)

    res.status(200).json({
      message: "OK",
      inventaryUpdate,
    });


  } catch (error) {
    console.log("Error al actualizar la cantidad en el inventario:", error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};


export const actualizarProducto = async (req, res) => {
  const { newProduct } = req.body;
  const { id: producto_Id } = req.params;
  try {

    if (!newProduct || !producto_Id) {
      throw new MissingDataError('Faltan datos para el proceso de actualizacion')
    }

    const productosUpdate = await updateProductInventaryBy(producto_Id, newProduct)

    res.status(200).json({
      message: "OK",
      productosUpdate,
    });

  } catch (error) {
    console.log('Hubo un error al actualizar la cantidad en el inventario.', error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};


export const eliminarProductos = async (req, res) => {
  const { id: producto_Id } = req.params;

  try {

    if (!producto_Id) {
      throw new MissingDataError('El id del producto es requerido')
    }

    const daleteUpdate = await deleteProductBy(producto_Id)

    res.status(200).json({
      message: "Producto y cantidad en inventario eliminados con éxito",
      daleteUpdate,
    });

  } catch (error) {
    console.log('Hubo un error al intentar eliminar el producto y su cantidad en inventario', error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};
