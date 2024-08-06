import { Categorias } from "../../models/index.js";
import { generarCodigoDesdeNombre } from "../../utils/generateCodigo.js";

// Controlador para  categorias y subcategorias

export const crearCategorias = async (req, res) => {
  const { nombre } = req.body;
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Acceso no autorizado" });
  }
  try {
    if (nombre) {
      // genera codigo para categoria
      const codigo = generarCodigoDesdeNombre(nombre);
      // crear nueva categoria en la db
      const nuevaCategoria = await Categorias.create({
        nombre,
        codigo,
      });
      if (nuevaCategoria) {
        // procede la busqueda de toda las cotegorias
        const categorias = await Categorias.findAll({
          attributes: ["id", "nombre"],
        });
        res.status(201).json({
          mensaje: "Categoria creada exitosamente",
          categorias: categorias,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      mensaje: "Hubo un problema al crear la categoria",
      error: error,
    });
  }
};

export const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categorias.findAll({
      attributes: ["id", "nombre"],
    });
    res.status(200).json({ categorias });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error al obtener las categorias" });
  }
};

export const eliminarCategoria = async (req, res) => {
  const { id } = req.body;

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Acceso no autorizado" });
  }
  try {
    const categoria = await Categorias.destroy({
      where: { id: id },
    });

    if (categoria) {
      const categorias = await Categorias.findAll({
        attributes: ["id", "nombre"],
      });
      return res
        .status(200)
        .json({ message: "Categoría eliminada exitosamente", categorias });
    } else {
      return res
        .status(404)
        .json({ message: "No se encontró la categoría a eliminar" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error al intentar eliminar la categoría" });
  }
};
