import { Categorias, Subcategorias} from "../../models/inventaryModel.js";
import { generarCodigoDesdeNombre } from "../../middleware/generateCodigo.js";

// Controlador para  categorias y subcategorias

export const crearCategorias = async (req, res) => {
  const { nombre } = req.body;
  try {
    // extraer elemntos
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

  try {
    const categoria = await Categorias.destroy({
      where: { id: id },
    });

    console.log(categoria);

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


// subcategorias

export const crearSubcategorias = async (req, res) => {
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
  const { id } = req.body;

  try {
    const categoriaEliminada = await Subcategorias.destroy({
      where: { id: id },
    });

    if (categoriaEliminada) {
      const categorias = await Subcategorias.findAll({
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
