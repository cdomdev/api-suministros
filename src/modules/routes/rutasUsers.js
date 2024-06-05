import express from "express";
import {
  buscarProductos,
  listarCategoria,
  listarSubcategoria, 
  listarProductos,
  // listarSubcategorias,
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
  validateEmail
} from "../controllers/user/auth.js";

import {
  feedBack,
  createPreferenceUser,
  createPreferenceInvited,
  reciveWebhookInvited,
  reciveWebhookUser,
  // reciveWebhook,
} from "../controllers/user/mercadoPago.js";

export const routerUser = express.Router();

// autenticacion
routerUser.post("/user/login", loginController);
// resgistro
routerUser.post("/user/registro", registroController);
// autenticacion y regsitro con google
routerUser.post("/user/oauth-google", googleLogin);
// restablecer contraseña
routerUser.post('/reset-password', resetPassword);
routerUser.post('/user/validate-email', validateEmail )
// datos de usuario
// perfil
routerUser.get("/user/profile", obtenerDatosUsuario);
// actualizar perfil
routerUser.post("/user/profile/update", actulizarDatosDeUsuario);

// listar productos --- lista de todos los prorudtos, no se usa tener en cuanta <- 👀
routerUser.get("/listar/productos", listarProductos);

// Listar categoria con prodcutos
routerUser.get("/categorias/:codigo", listarCategoria);
// listar productos por categorias
routerUser.get("/subcategorias/:codigo", listarSubcategoria);

// ofertas
routerUser.get("/listar/ofertas", listarOfertasConProductos);
// router.get("/obtener/ofertas", obtenerOfertasConProductos);

// busqueda de prodcutos
routerUser.post("/busqueda-productos", buscarProductos);

// compra

// Finalizar compra invitado
routerUser.post("/finish/buy/invited", finalizarCompraInvitado);
// finalizar compra usuario
routerUser.post("/finish/buy/user", finalizarCompraUsuario);

// finalizar pago con mercado pago
routerUser.post("/finish/buy/mercadopago-user", createPreferenceUser);

routerUser.post("/finish/buy/mercadopago-invited", createPreferenceInvited);

routerUser.post("/webhooks-invited", reciveWebhookInvited);

routerUser.post("/webhooks-user", reciveWebhookUser);

// routerUser.post("/webhooks-invited ", reciveWebhookInvited);

routerUser.get("/feedBack", feedBack);

// ver pedidos
routerUser.post("/user/listar-pedidos/:id", listarPedidoPorUsuario);

// module.exports = router;
