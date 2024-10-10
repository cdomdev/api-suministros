import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import { routerUser } from "./src/routes/rutasUsers.js";
import { routerAdmin } from "./src/routes/rutasAdmin.js";
import { conecction } from "./database/conecction.js";
import {
  Roles, Categorias,
  DetallesPedido,
  Inventario,
  Invitado,
  Notifacaciones,
  Ofertas,
  OfertasProductos,
  Pedido,
  Productos,
  Subcategorias,
  User
} from "./src/models/index.js";

const app = express();
const port = process.env.PORT || 3100;

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:4321", "http://localhost:4322", "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  })
);



app.use(cookieParser());



app.use("/", routerUser);
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

async function starServer() {
  try {
    await conecction.sync({ alter: true });
    await conecction.sync()
    await Roles.sync();
    await User.sync();
    await Categorias.sync();
    await Subcategorias.sync();
    await Productos.sync();
    await Ofertas.sync();
    await OfertasProductos.sync();
    await Inventario.sync();
    await Pedido.sync();
    await DetallesPedido.sync();
    await Invitado.sync();
    await Notifacaciones.sync();
    app.listen(port, () => {
      console.log(`El servidor se está ejecutando en el puerto ${port}`);
    });

  } catch (error) {
    console.log('Error al incializar las base de datos', error)
  }
}

starServer()
