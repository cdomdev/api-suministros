import { Subcategorias, Categorias, Productos } from "../../models/index.js";
import { NotFountError } from '../errorsInstances.js'


export const getCategoryBy = async (codigo) => {

  const categoria = await Categorias.findOne({
    where: { codigo: codigo },
    attributes: ["id", "nombre"],
  });

  if (!categoria) {
    throw new NotFountError("Subcategoría no encontrada")
  }

  const productos = await Productos.findAll({
    where: { categoria_id: categoria.id },
    attributes: [
      "id",
      "marca",
      "nombre",
      "valor",
      "description",
      "image",
      "referencia",
      "discount",
    ], include: [
      {
        model: Subcategorias,
        attributes: ["id", "nombre"],
      },
    ],

  });

  return productos


}

