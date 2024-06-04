import  Sequelize from "sequelize";
import  {
  Productos,
  Inventario,
  Categoria,
  CategoriaPadre
}  from "../../models/inventaryModel.js";


export const listarProductos = async (req, res) => {
  try {
    const productos = await Productos.findAll({
      attributes: [
        "id",
        "title",
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
          model: Categoria,
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
export const listarCategoriaProducto = async (req, res) => {
  try {
    const { codigoProducto } = req.params;

    const categoriaConProductos = await Categoria.findOne({
      where: { codigo: codigoProducto },
      attributes: ["id", "nombre"],
      include: [
        {
          model: Productos,
          attributes: [
            "id",
            "title",
            "nombre",
            "valor",
            "description",
            "image",
            "referencia",
          ],
        },
      ],
    });

    if (!categoriaConProductos) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json({ categoria: categoriaConProductos });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ error: "Error al obtener la categoría con productos" });
  }
};



// Categoria padre con subcategorias y productos asociados
export const listarCategoriaPadre = async (req, res) => {
  try {
    const { codigo } = req.params;

    // Buscar la categoría padre por su código
    const categoriaPadre = await CategoriaPadre.findOne({
      where: { codigo },
      attributes: ["id", "nombre"],
    });

    if (!categoriaPadre) {
      return res.status(404).json({ error: "Categoría principal no encontrada" });
    }

    // Buscar los productos asociados a la categoría padre
    const productos = await Productos.findAll({
      where: { categoria_padre_id: categoriaPadre.id }, 
      attributes: [
        "id",
        "title",
        "nombre",
        "valor",
        "description",
        "image",
        "referencia",
      ],
      include: [
        {
          model: Categoria,
          attributes: ['id', 'nombre']
        }
      ]
    });

    res.json({ categoriaPadre, productos });
  } catch (error) {
    console.error("Error al obtener la categoría principal y sus productos asociados:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};





// module.exports = {
//   listarProductos,
//   listarCategoriaPadre,
//   listarCategoriaProducto,
//   buscarProductos,
// };
