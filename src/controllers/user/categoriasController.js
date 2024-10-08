import { getSubCategoryBy } from "../../helpers/userHelpers/subcategoriasHelper.js";
import { getCategoryBy } from "../../helpers/userHelpers/categoriasHelpers.js";
import { NotFountError, ErrorServer } from '../../helpers/errorsInstances.js'


export const listarSubcategoria = async (req, res) => {
  const { codigo } = req.params;

  try {
    const productos = await getSubCategoryBy(codigo)

    res.status(200).json({ productos });

  } catch (error) {
    console.log(
      "Error al obtener las subcategorías y sus productos asociados:",
      error
    );
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};


export const listarCategoria = async (req, res) => {
  const { codigo } = req.params;

  try {

    const productos = await getCategoryBy(codigo)

    res.status(200).json({ productos });

  } catch (error) {
    console.log("Error al obtener las categorías y sus productos asociados:", error);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  };
}

