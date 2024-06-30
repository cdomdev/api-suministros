import { User, Invitado } from "../../models/usersModels.js";

import {
  Productos,
  Pedido,
  DetallesPedido,
  Inventario,
} from "../../models/inventaryModel.js";

// Controlador para gauradr productos
export const guardarProducto = async (req, res) => {
  const { productos } = req.body;
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Acceso no autorizado" });
    }

    for (const producto of productos) {
      const nuevoProducto = await Productos.create({
        title: producto.title,
        nombre: producto.nombre,
        valor: producto.valor,
        description: producto.description,
        referencia: producto.referencia,
        categoria_id: parseInt(producto.categoria_id),
        subcategoria_id: parseInt(producto.subcategoria_id),
        image: producto.image,
      });

      if (!nuevoProducto) {
        return res.status(500).json({ error: "No se pudo crear el producto" });
      }

      const createdInventario = await Inventario.create({
        producto_Id: nuevoProducto.id,
        cantidad: producto.cantidad,
      });

      if (!createdInventario) {
        return res.status(500).json({
          error: "No se pudo crear el inventario asociado al producto",
        });
      }
    }
    return res
      .status(200)
      .json({ message: "Productos guardados exitosamente" });
  } catch (error) {
    console.error("Error al guardar los productos:", error);
    return res
      .status(500)
      .json({ error: "Hubo un problema al procesar la solicitud" });
  }
};

export const saveImagenServer = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("Por favor, sube una o más imágenes");
    }
    const uploadedFiles = req.files.map((file) => {
      // Modifica la URL base según tu estructura
      const imageUrl = `http://localhost:3000/src/modules/uploads/products/${file.filename}`;
      return {
        originalName: file.originalname,
        imageUrl: imageUrl,
      };
    });

    res.status(200).json({ uploadedFiles: uploadedFiles });
  } catch (error) {
    console.error("Error al subir las imágenes:", error);
    res.status(500).send("Error al subir las imágenes");
  }
};

// pedidos
