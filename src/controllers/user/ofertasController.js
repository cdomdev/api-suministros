import { Ofertas, Productos } from "../../models/index.js";
import { Op } from "sequelize";

// listar productos con ofertas
export const listarOfertasConProductos = async (req, res) => {
  try {
    const ofertas = await Productos.findAll({
      where: {
        discount: {
          [Op.ne]: null,
          [Op.gt]: 0,
        },
      },
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

    if (!ofertas || ofertas.length === 0) {
      return res.status(400).json({ message: "No hay productos en las ofertas" });
    }


    return res.status(200).json({ productos: ofertas });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al obtener las ofertas" });
  }
};
