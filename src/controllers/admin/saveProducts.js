import { Productos, Inventario } from "../../models/index.js";

// Controlador para gauradr productos
export const guardarProducto = async (req, res) => {
  const { productos } = req.body;
  // if (req.user.role !== "admin") {
  //   return res
  //     .status(403)
  //     .json({ success: false, message: "Acceso no autorizado" });
  // }
  console.log("productos --_> ", productos);
  console.log("productos --_> ", req.body);
  try {
    for (const producto of productos) {
      const nuevoProducto = await Productos.create({
        marca: producto.marca,
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
