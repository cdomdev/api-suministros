import express from "express";
import { imageUpload } from "../utils/imageUpload.js";
import { saveImagenServer } from "../controllers/admin/saveImageServer.js";
import { guardarProducto } from "../controllers/admin/saveProducts.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { loginAdmin, logout, registerAdmin } from '../controllers/admin/auth.js'
import {
  listarPedidoPorUsuario,
  listarPedidoPorInvitado,
  updateStateOrders,
  listarPedidos,
} from "../controllers/admin/pedidosController.js";

import {
  actualizarProducto,
  actulizarStock,
  eliminarProductos,
  listarProductos,
} from "../controllers/admin/inventarioController.js";

import {
  actulizarOfertas,
  crearOfetas,
  eliminarOferta,
  obtenerOfertasConProductos,
  obtenerProductos,
} from "../controllers/admin/ofertasControler.js";

import {
  crearCategorias,
  eliminarCategoria,
  listarCategorias,
} from "../controllers/admin/categorias.js";

import {
  crearSubcategorias,
  eliminarSubcategoria,
  listarSubcategorias,
} from "../controllers/admin/subcategorias.js";
import {
  balances,
  mostSalledsProducts,
  salesMonth,
} from "../controllers/admin/balances.js";
import {
  deleteNotifications,
  notificationList,
  tickRead,
} from "../controllers/admin/notificationsAdmin.js";

export const routerAdmin = express.Router();


routerAdmin.post("/auth-admin", loginAdmin);

routerAdmin.post("/admin-register", registerAdmin);

// productos guardar
routerAdmin.post("/save-news-products", authenticateToken, guardarProducto);

routerAdmin.post("/upload", imageUpload.array("files"), saveImagenServer);

// categorias
routerAdmin.post("/categories/create", authenticateToken, crearCategorias);

routerAdmin.get("/categories/list", listarCategorias);

routerAdmin.delete(
  "/categories/delete/:id",
  authenticateToken,
  eliminarCategoria
);

// subcategorias
routerAdmin.post(
  "/subcategories/create",
  authenticateToken,
  crearSubcategorias
);

routerAdmin.get("/subcategories/list", listarSubcategorias);

routerAdmin.delete(
  "/subcategories/delete/:id",
  authenticateToken,
  eliminarSubcategoria
);

// inventario
routerAdmin.get("/inventary/list-products", listarProductos);

routerAdmin.put(
  "/inventary/products/update-stock/:id",
  authenticateToken,
  actulizarStock
);

routerAdmin.put(
  "/inventary/products/update/:id",
  authenticateToken,
  actualizarProducto
);

routerAdmin.delete(
  "/inventary/products/delete/:id",
  authenticateToken,
  eliminarProductos
);

// ofertas

routerAdmin.get("/productos", obtenerProductos);

routerAdmin.post("/crear/ofertas", authenticateToken, crearOfetas);

routerAdmin.get(
  "/listar/ofertas",
  authenticateToken,
  obtenerOfertasConProductos
);

routerAdmin.delete("/oferta/delete/:id", authenticateToken, eliminarOferta);

routerAdmin.put("/oferta/update/:id", authenticateToken, actulizarOfertas);

// listar pedido

routerAdmin.get("/listar/usuarios-con-pedidos", authenticateToken, listarPedidos);
routerAdmin.get("/listar/pedidos-usuario/:id",
  authenticateToken,
  listarPedidoPorUsuario);
routerAdmin.get("/listar/pedidos-invitado/:id",
  authenticateToken,
  listarPedidoPorInvitado);

routerAdmin.post(
  "/update/state-orders/:id",
  authenticateToken,
  updateStateOrders
);

routerAdmin.post("/logout", logout);

// balances

routerAdmin.get("/see-balance-sheets", balances);
routerAdmin.get("/see-best-sallers",
  //  authenticateToken,
  mostSalledsProducts);
routerAdmin.get("/sales-month", salesMonth);
// notificaciones

routerAdmin.get("/notifications-admin", authenticateToken, notificationList);
routerAdmin.delete(
  "/delete-nofitication/:id",
  authenticateToken,
  deleteNotifications
);

routerAdmin.post("/tick-read/:id", authenticateToken, tickRead);
