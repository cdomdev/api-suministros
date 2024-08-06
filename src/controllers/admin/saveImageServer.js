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
