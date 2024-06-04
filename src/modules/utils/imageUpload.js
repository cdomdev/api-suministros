import path from 'path';
import  multer from 'multer'

// Configuración de Multer para guardar archivos en el directorio 'uploads'
 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/modules/uploads/products');
  },
  filename: function (req, file, cb) {
    // Generar un nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Crear el middleware de Multer con la configuración
export const imageUpload = multer({ storage: storage });


// module.exports = upload;
