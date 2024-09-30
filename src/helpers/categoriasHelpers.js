import { Subcategorias, Categorias, Productos} from "../models/index.js";
import {NotFountError} from '../helpers/errorsInstances.js'



export const getSubCategoryBy = async(codigo) =>{
    try {

      const categoriasDb = await Subcategorias.findOne({
        where: { codigo },
        attributes: ["id", "nombre"],
      });
  
      if (!categoriasDb) {
        throw new NotFountError("Subcategoría no encontrada") 
      }
  
      const productos = await Productos.findAll({
        where: { subcategoria_id: categoriasDb.id },
        attributes: [
          "id",
          "marca",
          "nombre",
          "valor",
          "description",
          "image",
          "referencia",
          "discount",
        ],
        include: [
            {
              model: Subcategorias,
              attributes: ["id", "nombre"],
            },
          ],
      });

      return productos

    } catch (error) {
        throw error
    }
}


export const getCategoryBy = async(codigo) =>{
    try {

      const categoriasDb = await Categorias.findOne({
        where: { codigo },
        attributes: ["id", "nombre"],
      });
  
      if (!categoriasDb) {
        throw new NotFountError("Categoría no encontrada") 
      }
  
      const productos = await Productos.findAll({
        where: { subcategoria_id: categoriasDb.id },
        attributes: [
          "id",
          "marca",
          "nombre",
          "valor",
          "description",
          "image",
          "referencia",
          "discount",
        ],
       
      });

      return productos

    } catch (error) {
        throw error
    }
}