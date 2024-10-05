import { createSubcategory, deletSubcategoria, getAllSubcategies } from "../../helpers/adminHelpers/subcategoriaHelpers.js";
import { MissingDataError, ErrorServer, NotFountError } from "../../helpers/errorsInstances.js";

export const crearSubcategorias = async (req, res) => {
  const { nombre } = req.body;
  try {

    const subcategorias = await createSubcategory(nombre)

    res.status(201).json({
      mensaje: "Categoria creada exitosamente",
      categorias: subcategorias,
    });

  } catch (error) {
    console.log('Hubo un error al crear la categoria', error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};

export const listarSubcategorias = async (req, res) => {
  try {

    const categorias = await getAllSubcategies()

    res.status(200).json({ categorias });
  } catch (e) {
    console.log('"Error al obtener las subcategorias" ', e);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};

export const eliminarSubcategoria = async (req, res) => {
  const { id } = req.params;

  try {

    const subcategorias = await deletSubcategoria(id)

    return res.status(200).json({
      message: "Subcategoría eliminada exitosamente",
      categorias: subcategorias,
    });

  } catch (error) {
    console.log("Error Al intentar eliminar una subcategiria", error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};
