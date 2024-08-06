import { DataTypes } from "sequelize";
import { conecction } from "../../database/conecction.js";
import { DetallesPedido, User, Invitado } from "./index.js";
// modelo de pedidos
export const Pedido = conecction.define(
  "pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    invitado_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "pedido",
    timestamps: false,
  }
);
