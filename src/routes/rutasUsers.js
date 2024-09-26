import express from "express";
import {
  buscarProductos,
  listarCategoria,
  listarProductoID,
  listarProductos,
  listarSubcategoria,
  masVendidos,
} from "../controllers/user/productsController.js";
import {
  finalizarCompraInvitado,
  finalizarCompraUsuario,
} from "../controllers/user/buysControllers.js";
import {
  actulizarDatosDeUsuario,
  obtenerDatosUsuario,
} from "../controllers/user/dataUserController.js";
import { listarPedidoPorUsuario } from "../controllers/user/ordersController.js";
import { listarOfertasConProductos } from "../controllers/user/ofertasController.js";
import {
  googleLogin,
  loginController,
  resetPassword,
  registroController,
  validateEmail,
  logout,
} from "../controllers/user/auth.js";
import { refreshToken } from "../controllers/user/refreshToken.js";
import { feedBack, reciveWebhook } from "../controllers/user/webhooks.js";

import { createPreferenceUser } from "../controllers/user/createPreferenceUser.js";
import { createPreferenceInvited } from "../controllers/user/createPreferenceInvited.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

export const routerUser = express.Router();

// autenticacion
routerUser.post("/user/login", loginController);

// autenticacion
routerUser.post("/user/logout", logout);


// refresh token

routerUser.post("/refresh-token", refreshToken);
// resgistro
routerUser.post("/user/register", registroController);
// autenticacion y regsitro con google
routerUser.post("/user/google-auth", googleLogin);
// restablecer contraseña
routerUser.post("/reset-password/:token", resetPassword);

routerUser.post("/user/validate-email", validateEmail);

// datos de usuario
// perfil
routerUser.get("/user/profile", obtenerDatosUsuario);
// actualizar perfil
routerUser.post(
  "/user/profile-update",
  actulizarDatosDeUsuario
);


routerUser.get("/productos", listarProductos)
routerUser.get("/producto/:id", listarProductoID);

routerUser.get("/productos/list-most-salleds", masVendidos);

routerUser.get("/categorias/:codigo", listarCategoria);

routerUser.get("/subcategorias/:codigo", listarSubcategoria);

routerUser.get("/ofertas", listarOfertasConProductos);

routerUser.post("/busqueda-productos", buscarProductos);

// compra

routerUser.post("/finish/buy-invited", finalizarCompraInvitado);

routerUser.post("/finish/buy-user", finalizarCompraUsuario);

routerUser.post("/finish/mercadopago-user", createPreferenceUser);

routerUser.post("/finish/mercadopago-invited", createPreferenceInvited);

routerUser.post("/webhooks-invited", reciveWebhook);

routerUser.post("/webhooks-user", reciveWebhook);

routerUser.get("/feedBack", feedBack);

routerUser.get("/user/pedidos/:id", listarPedidoPorUsuario);
