import Sequelize from "sequelize";
import {
  Productos,
  Inventario,
  Categorias,
  Subcategorias,
} from "../../models/index.js";

// Listar productos - inventario
export const listarProductos = async (req, res) => {
  try {
    const productos = await Productos.findAll({
      attributes: [
        "id",
        "marca",
        "nombre",
        "valor",
        "description",
        "image",
        "referencia",
        "categoria_id",
      ],
      include: [
        {
          model: Inventario,
          attributes: ["cantidad"],
        },
        {
          model: Categorias,
          attributes: ["nombre"],
        },
      ],
    });
    res.json({ productos: productos });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

// Modulo para busqueda de productos
export const buscarProductos = (req, res) => {
  const { query } = req.body;

  // Realizar la búsqueda
  Productos.findAll({
    where: {
      nombre: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("nombre")),
        "LIKE",
        `%${query.toLowerCase()}%`
      ),
    },
  })
    .then((resultados) => {
      if (resultados && resultados.length > 0) {
        return res
          .status(200)
          .json({ message: "Productos encontrados", resultados: resultados });
      } else {
        return res.status(404).json({
          message: "No se encontraron productos para la búsqueda proporcionada",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Error en el servidor al buscar productos",
        error: err,
      });
    });
};

// Modulo de subcategorias

export const listarSubcategoria = async (req, res) => {
  try {
    const { codigo } = req.params;
    console.log(`Código recibido: ${codigo}`);

    // Buscar la categoría padre por su código
    const categoriasDb = await Subcategorias.findOne({
      where: { codigo },
      attributes: ["id", "nombre"],
    });

    if (!categoriasDb) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    // Buscar los productos asociados a la categoría padre
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
      ],
    });

    res.json({ productos });
  } catch (error) {
    console.error(
      "Error al obtener las subcategorías y sus productos asociados:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const listarCategoria = async (req, res) => {
  try {
    const { codigo } = req.params;

    // Buscar la categoría padre por su código
    const categoriasDb = await Categorias.findOne({
      where: { codigo },
      attributes: ["id", "nombre"],
    });

    if (!categoriasDb) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    // Buscar los productos asociados a la categoría padre
    const productos = await Productos.findAll({
      where: { categoria_id: categoriasDb.id },
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

    res.json({ productos });
  } catch (error) {
    console.error(
      "Error al obtener las categorías y sus productos asociados:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const masVendidos = async (req, res) => {
  try {
    // Obtener los productos más vendidos
    const products = await Productos.findAll({
      order: [["sales_count", "DESC"]],
      limit: 4,
    });

    // Enviar la lista de productos
    return res.status(200).json({ data: products });
  } catch (error) {
    console.log("Error al obtener las lista de productos mas vendidos", error);
  }
};
