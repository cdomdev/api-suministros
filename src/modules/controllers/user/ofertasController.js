import { Ofertas, Productos } from "../../models/inventaryModel.js";

// listar ofertas con productos relacionados
export const listarOfertasConProductos = async (req, res) => {
  try {
    const ofertas = await Ofertas.findAll({
      include: {
        model: Productos,
        attributes: [
          "id",
          "marca",
          "nombre",
          "description",
          "referencia",
          "image",
          "valor",
        ],
        through: "productos_ofertas",
      },
    });

    if (!ofertas) {
      return res.status(400).json({ message: "Oferta no encontrada" });
    }
    return res.status(200).json({ ofertas });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al obetenr la oferta" });
  }
};
