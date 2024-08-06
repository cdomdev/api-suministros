import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3100;

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

import { routerUser } from "./src/routes/rutasUsers.js";
app.use("/", routerUser);

import { routerAdmin } from "./src/routes/rutasAdmin.js";
app.use("/api", routerAdmin);

// Direcciones estáticas
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

app.use(
  "/src/modules/uploads/products",
  express.static("src/modules/uploads/products")
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
});

app.listen(port, () => {
  console.log(`El servidor se está ejecutando en el puerto ${port}`);
});
