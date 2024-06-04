import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Configuración de la base de datos
const dbConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

// Crear conexión de Sequelize
export const conecction = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: "mysql",
  }
);

// Verificar la conexión y sincronizar modelos
conecction
  .sync()
  .then(() => {
    console.log("Conexión a la base de datos exitosa (Sequelize)");
  })
  .catch((error) => {
    console.error(
      "Error al conectar a la base de datos (Sequelize):",
      error.message
    );
  });


