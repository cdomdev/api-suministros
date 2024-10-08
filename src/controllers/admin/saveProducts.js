import { saveProducto } from "../../helpers/adminHelpers/productsHelper.js";
import { MissingDataError, ErrorServer, NotFountError } from "../../helpers/errorsInstances.js";

export const saveImagenServer = (req, res) => {
  try {

    if (!req.files || req.files.length === 0) {
      throw new MissingDataError('Faltan datos, por favor sua una o mas imagenes')
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
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};

export const guardarProducto = async (req, res) => {
  const { productos } = req.body;

  try {

    await saveProducto(productos)

    return res
      .status(200)
      .json({ message: "Productos guardados exitosamente" });


  } catch (error) {
    console.error("Error al guardar los productos:", error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};
