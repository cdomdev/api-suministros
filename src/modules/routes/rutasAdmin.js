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

export const routerAdmin = express.Router();

// productos guardar
routerAdmin.post("/guardarproductos", guardarProducto);

routerAdmin.post("/upload", imageUpload.array("files"), saveImagenServer);

// usuarios

// categorias
routerAdmin.post("/crear/categorias", crearCategorias);

routerAdmin.get("/obtener/categorias", listarCategorias);

routerAdmin.delete("/delete/:id/categorias", eliminarCategoria);

// subcategorias
routerAdmin.post("/crear/sub-categoria", crearSubcategorias);

routerAdmin.get("/obtener/sub-categorias", listarSubcategorias);

routerAdmin.delete("/delete/:id/sub-categoria", eliminarSubcategoria);

// inventario

routerAdmin.get("/listar/productos", listarProductos);

routerAdmin.put("/productos/:id/inventario", actulizarStock);

routerAdmin.put("/productos/:id/actualizar", actualizarProducto);

routerAdmin.delete("/productos/:id/eliminar", eliminarProductos);

// ofertas

routerAdmin.get("/productos", obtenerProductos);

routerAdmin.post("/crear/ofertas", crearOfetas);

routerAdmin.get("/listar/ofertas", obtenerOfertasConProductos);

routerAdmin.delete("/oferta/:id/eliminar", eliminarOferta);

routerAdmin.put("/oferta/:id/actualizar", actulizarOfertas);

// listar pedido

routerAdmin.get("/listar/usuarios", listarUsuariosConPedidos);
routerAdmin.get("/listar/invitados", listarInvitadosConPedidos);
routerAdmin.post("/listar/pedidos-usuario/:id", listarPedidoPorUsuario);
routerAdmin.post("/listar/pedidos-invitado/:id", listarPedidoPorInvitado);

routerAdmin.post("/update/state-orders", updateStateOrders);
