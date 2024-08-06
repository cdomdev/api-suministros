import { DataTypes } from "sequelize";
import { conecction } from "../../database/conecction.js";
import { Productos, Pedido } from "./index.js";

// modelo de detalles pedidos
export const DetallesPedido = conecction.define(
  "detalles_pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sub_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_pago: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    costo_de_envio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado_pedido: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metodo_pago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descuento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status_detail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "detalles_pedido",
    timestamps: true,
  }
);
