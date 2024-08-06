import { DataTypes } from "sequelize";
import { conecction } from "../../database/conecction.js";

export const Inventario = conecction.define(
  "Inventario",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    producto_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Productos",
        key: "id",
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La cantidad de productos es requerida",
        },
        min: {
          args: [0],
          msg: "La cantidad debe ser un número positivo",
        },
      },
    },
  },
  {
    tableName: "Inventario",
    timestamps: false,
  }
);
