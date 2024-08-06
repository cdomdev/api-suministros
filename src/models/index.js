// src/models/index.js
import { Categorias } from "./categorias.js";
import { Productos } from "./Productos.js";
import { DetallesPedido } from "./detallesPedido.js";
import { Inventario } from "./inventario.js";
import { Invitado } from "./invitado.js";
import { Notifcaciones } from "./notificaciones.js";
import { Ofertas } from "./ofertas.js";
import { OfertasProductos } from "./ofertasProductos.js";
import { Pedido } from "./pedido.js";
import { Roles } from "./roles.js";
import { Subcategorias } from "./subcategorias.js";
import { User } from "./user.js";

//------ Relaciones entre modelos ------

// Relación pedido - detalles pedido
Pedido.hasMany(DetallesPedido, {
  as: "detalles_pedido",
  foreignKey: "pedido_id",
});

DetallesPedido.belongsTo(Pedido, { foreignKey: "pedido_id" });

// detalles_pedidos - productos
DetallesPedido.belongsTo(Productos, { foreignKey: "producto_id" });

// productos - detalles_pedidos
Productos.hasMany(DetallesPedido, { foreignKey: "producto_id" });

// productos - categorias
Productos.belongsTo(Categorias, { foreignKey: "categoria_id" });
Categorias.hasMany(Productos, { foreignKey: "categoria_id" });

// productos - subcategorias
Productos.belongsTo(Subcategorias, { foreignKey: "subcategoria_id" });
Subcategorias.hasMany(Productos, { foreignKey: "subcategoria_id" });

// productos - inventario
Productos.hasMany(Inventario, { foreignKey: "producto_id" });

// productos - tabla intermediaria de ofertas
Productos.belongsToMany(Ofertas, {
  through: "productos_ofertas",
  foreignKey: "id_productos",
  onDelete: "CASCADE",
});

Ofertas.belongsToMany(Productos, {
  through: "productos_ofertas",
  foreignKey: "id_ofertas",
  onDelete: "CASCADE",
});

// definición de relaciones entre modelos
User.hasMany(Pedido, { foreignKey: "usuario_id" });
User.belongsTo(Roles, { foreignKey: "rol_user_id", as: "roles" });

Roles.hasMany(User, { foreignKey: "rol_user_id", as: "usuarios" });

Invitado.hasMany(Pedido, { foreignKey: "invitado_id" });

Pedido.belongsTo(User, { foreignKey: "usuario_id" });
Pedido.belongsTo(Invitado, { foreignKey: "invitado_id" });

export {
  Categorias,
  DetallesPedido,
  Inventario,
  Invitado,
  Notifcaciones,
  Ofertas,
  OfertasProductos,
  Pedido,
  Productos,
  Roles,
  Subcategorias,
  User,
};
