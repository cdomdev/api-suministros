import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

// instancia de express
const app = express();
const port = process.env.PORT || 3100;

// Formateo
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// rutas
import { routerUser } from "./src/modules/routes/rutasUsers.js";
app.use("/", routerUser);

import { routerAdmin } from "./src/modules/routes/rutasAdmin.js";
app.use("/api", routerAdmin);

// Direcciones estáticas
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

app.use(
  "/src/modules/uploads/products",
  express.static("src/modules/uploads/products")
);

app.use(express.static(path.join(__dirname, "public")));

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
});

app.listen(port, () => {
  console.log(`El servidor se está ejecutando en el puerto ${port}`);
});
