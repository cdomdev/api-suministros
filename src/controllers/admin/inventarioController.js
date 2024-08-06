import {
  Productos,
  Inventario,
  Subcategorias,
  Categorias,
} from "../../models/index.js";

// Controlador para listar productos invenatario

export const listarProductos = async (req, res) => {
  try {
    const productos = await Productos.findAll({
      attributes: [
        "id",
        "nombre",
        "marca",
        "valor",
        "description",
        "image",
        "referencia",
      ],
      include: [
        {
          model: Inventario,
          attributes: ["cantidad"],
        },
        {
          model: Categorias,
          attributes: ["id", "nombre"],
        },
        {
          model: Subcategorias,
          attributes: ["id", "nombre"],
        },
      ],
    });
    res.status(200).json({ productos });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

// Controlador para actulizar inventario
export const actulizarStock = async (req, res) => {
  const { producto_Id, newStock } = req.body;
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Acceso no autorizado" });
  }

  try {
    const inventario = await Inventario.findOne({ where: { producto_Id } });
    if (inventario) {
      // actualizar la cantidad en el inventario
      await Inventario.update(
        { cantidad: newStock },
        { where: { producto_Id: producto_Id } }
      );
      const inventaryUpdate = await Productos.findAll({
        attributes: [
          "id",
          "nombre",
          "marca",
          "valor",
          "description",
          "image",
          "referencia",
          "categoria_id",
          "subcategoria_id",
        ],
        include: [
          {
            model: Inventario,
            attributes: ["cantidad"],
          },
          {
            model: Categorias,
            attributes: ["id", "nombre"],
          },
          {
            model: Subcategorias,
            attributes: ["id", "nombre"],
          },
        ],
      });

      return res.status(200).json({
        message: "Cantidad en el inventario actualizada exitosamente.",
        inventaryUpdate,
      });
    } else {
      return res.status(404).json({
        message: "No se encontró el registro de inventario para el producto.",
      });
    }
  } catch (error) {
    console.log(error);
    console.error("Error al actualizar la cantidad en el inventario:", error);
    return res.status(500).json({
      error: "Hubo un error al actualizar la cantidad en el inventario.",
    });
  }
};

// Actulizar los productos en inventario
export const actualizarProducto = async (req, res) => {
  const { producto_Id, newProduct } = req.body;

  const {
    nombre,
    marca,
    valor,
    description,
    referencia,
    categoria_id,
    subcategoria_id,
  } = newProduct;

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Acceso no autorizado" });
  }
  try {
    const productos = await Productos.findOne({ where: { id: producto_Id } });
    if (productos) {
      await Productos.update(
        {
          nombre,
          marca,
          valor,
          description,
          referencia,
          categoria_id,
          subcategoria_id,
        },
        { where: { id: producto_Id } }
      );
      const productosUpdate = await Productos.findAll({
        attributes: [
          "id",
          "nombre",
          "marca",
          "valor",
          "description",
          "image",
          "referencia",
          "categoria_id",
          "subcategoria_id",
        ],
        include: [
          {
            model: Inventario,
            attributes: ["cantidad"],
          },
          {
            model: Categorias,
            attributes: ["id", "nombre"],
          },
          {
            model: Subcategorias,
            attributes: ["id", "nombre"],
          },
        ],
      });
      return res.status(200).json({
        message: "Producto atualizado exitosamente.",
        productosUpdate,
      });
    } else {
      return res.status(404).json({
        message: "No se encontró el registro producto.",
      });
    }
  } catch (error) {
    console.log(error);
    console.log("Error interno del servidor", error);
    return res.status(500).json({
      error: "Hubo un error al actualizar la cantidad en el inventario.",
    });
  }
};

// Eliminar productos de inventario
export const eliminarProductos = async (req, res) => {
  const { producto_Id } = req.body;

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Acceso no autorizado" });
  }
  try {
    // Eliminar el producto por su ID
    const productoEliminado = await Productos.destroy({
      where: { id: producto_Id },
    });

    if (!productoEliminado) {
      return res
        .status(404)
        .json({ message: "No se pudo encontrar el producto" });
    }

    // Eliminar la cantidad en inventario relacionada al producto
    const inventarioEliminado = await Inventario.destroy({
      where: { producto_Id: producto_Id },
    });

    const daleteUpdate = await Productos.findAll({
      attributes: [
        "id",
        "nombre",
        "marca",
        "valor",
        "description",
        "image",
        "referencia",
        "categoria_id",
        "subcategoria_id",
      ],
      include: [
        {
          model: Inventario,
          attributes: ["cantidad"],
        },
        {
          model: Categorias,
          attributes: ["id", "nombre"],
        },
        {
          model: Subcategorias,
          attributes: ["id", "nombre"],
        },
      ],
    });

    // Si ambos borrados fueron exitosos
    return res.status(200).json({
      message: "Producto y cantidad en inventario eliminados con éxito",
      daleteUpdate,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error:
        "Hubo un error al intentar eliminar el producto y su cantidad en inventario.",
    });
  }
};
