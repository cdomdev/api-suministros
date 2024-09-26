import { DataTypes } from "sequelize";
import { conecction } from "../../database/conecction.js";

// modelo de pedidos
export const Pedido = conecction.define(
  "pedido",
  {
    id: {
      type: DataTypes.STRING,
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
    pago_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    costo_de_envio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    metodo_de_pago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado_pedido: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status_mercadopago: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mercadopago_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "pedido",
    timestamps: false,
  }
);
