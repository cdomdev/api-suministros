import { MissingDataError, NotFountError, ErrorServer } from '../../helpers/errorsInstances.js'
import { deleteCategoryBy, getAllCategories, newCategory } from "../../helpers/adminHelpers/categoriasHelpers.js";

export const crearCategorias = async (req, res) => {
  const { nombre } = req.body;
  try {

    const categorias = await newCategory(nombre)

    res.status(201).json({
      mensaje: "Categoria creada exitosamente",
      categorias: categorias,
    });

  } catch (error) {
    console.log('Hubo un error al crear la nueva categoria', error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }

  }
};

export const listarCategorias = async (req, res) => {
  try {

    const categorias = await getAllCategories()

    res.status(200).json({ categorias });

  } catch (e) {
    console.log('Error al listar las categorias', e);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};

export const eliminarCategoria = async (req, res) => {
  const { id } = req.params;

  try {

    const categorias = await deleteCategoryBy(id)
    return res
      .status(200)
      .json({ message: "Categoría eliminada exitosamente", categorias });


  } catch (error) {
    console.error('Error al intentar eliminar la categoría', error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};
