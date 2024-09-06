import { Subcategorias } from "../../models/index.js";
import { generarCodigoDesdeNombre } from "../../utils/generateCodigo.js";

// subcategorias

export const crearSubcategorias = async (req, res) => {
  // if (req.user.role !== "admin") {
  //   return res
  //     .status(403)
  //     .json({ success: false, message: "Acceso no autorizado" });
  // }
  try {
    // extraer elemntos
    if (req) {
      const { nombre } = req.body;
      // genera codigo para categoria

      const codigo = generarCodigoDesdeNombre(nombre);
      // crear nueva categoria en la db
      const nuevaCategoria = await Subcategorias.create({ nombre, codigo });

      // retornar las categorias
      const subCate = await Subcategorias.findAll({
        attributes: ["id", "nombre"],
      });
      if (subCate) {
        res.status(201).json({
          mensaje: "Categoria creada exitosamente",
          categorias: subCate,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      mensaje: "Huno un problema al crear la categoria",
      error: error,
    });
  }
};

export const listarSubcategorias = async (req, res) => {
  try {
    const categorias = await Subcategorias.findAll({
      attributes: ["id", "nombre"],
    });
    res.status(200).json({ categorias });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error al obtener las subcategorias" });
  }
};

export const eliminarSubcategoria = async (req, res) => {
  const { id } = req.params;
  // if (req.user.role !== "admin") {
  //   return res
  //     .status(403)
  //     .json({ success: false, message: "Acceso no autorizado" });
  // }
  if (!id) {
    return res
      .status(400)
      .json({ error: "ID de subcategoría no proporcionado" });
  }

  try {
    const subcategoriaExistente = await Subcategorias.findOne({
      where: { id: id },
    });

    if (!subcategoriaExistente) {
      return res.status(404).json({ message: "Subcategoría no encontrada" });
    }
    await Subcategorias.destroy({
      where: { id: id },
    });

    const categoriasRestantes = await Subcategorias.findAll({
      attributes: ["id", "nombre"],
    });

    return res.status(200).json({
      message: "Subcategoría eliminada exitosamente",
      categorias: categoriasRestantes,
    });
  } catch (error) {
    console.log("Error interno del servidor", error);
    res.status(500).json({ message: "Error interne del servidor" });
  }
};
