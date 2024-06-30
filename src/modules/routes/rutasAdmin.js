import { imageUpload } from "../utils/imageUpload.js";
import {
  guardarProducto,
  saveImagenServer,
} from "../controllers/admin/adminController.js";
import {
  listarPedidoPorUsuario,
  listarPedidoPorInvitado,
  listarUsuariosConPedidos,
  listarInvitadosConPedidos,
  updateStateOrders,
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
  crearSubcategorias,
  eliminarSubcategoria,
  listarSubcategorias,
  crearCategorias,
  eliminarCategoria,
  listarCategorias,
} from "../controllers/admin/categorias.js";

import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { logout } from "../controllers/admin/logoutAdmin.js";

export const routerAdmin = express.Router();

// productos guardar
routerAdmin.post("/save-news-products", authenticateToken, guardarProducto);

routerAdmin.post("/upload", imageUpload.array("files"), saveImagenServer);

// usuarios

// categorias
routerAdmin.post("/categories/create", authenticateToken, crearCategorias);

routerAdmin.get("/categories/list", authenticateToken, listarCategorias);

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
routerAdmin.get("/inventary/list-products", authenticateToken, listarProductos);

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

routerAdmin.get("/listar/usuarios", listarUsuariosConPedidos);
routerAdmin.get("/listar/invitados", listarInvitadosConPedidos);
routerAdmin.post("/listar/pedidos-usuario/:id", listarPedidoPorUsuario);
routerAdmin.post("/listar/pedidos-invitado/:id", listarPedidoPorInvitado);

routerAdmin.post("/update/state-orders", authenticateToken, updateStateOrders);
routerAdmin.post("/logout", logout);
