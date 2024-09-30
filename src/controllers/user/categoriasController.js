import { getCategoryBy, getSubCategoryBy } from "../../helpers/categoriasHelpers.js";
import { NotFountError, ErrorServer, MissingDataError } from '../../helpers/errorsInstances.js'


export const listarSubcategoria = async (req, res) => {
  const { codigo } = req.params;
  
  try {
    if(!codigo){
      throw new MissingDataError('No hay codigo para la busqueda')
    }

    const productos = await getSubCategoryBy(codigo)

    res.status(200).json({ productos });

  } catch (error) {
    if(error instanceof MissingDataError){
      return res.status(error.statusCode).json({ message: error.message });
    }else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(
        "Error al obtener las subcategorías y sus productos asociados:",
        error
      );
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};


export const listarCategoria = async (req, res) => {
  try {
    const { codigo } = req.params;
    if(!codigo){
      throw new MissingDataError('No hay codigo para la busqueda')
    }

    const productos = getCategoryBy(codigo)

    res.status(200).json({ productos });

  } catch (error) {
    if(error instanceof MissingDataError){
      return res.status(error.statusCode).json({ message: error.message });
    }else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(
        "Error al obtener las categorías y sus productos asociados:",
        error
      );
      return res.status(500).json({ error: new ErrorServer().message });
    }
  };
}

