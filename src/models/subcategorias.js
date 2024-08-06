import { DataTypes } from "sequelize";
import { conecction } from "../../database/conecction.js";
import { Productos } from "./index.js";

// modelo de las subcategorias
export const Subcategorias = conecction.define(
  "subcategorias",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La categoria es requerida",
        },
      },
    },
    codigo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El código de la categoría es requerido",
        },
      },
    },
  },
  {
    tableName: "subcategorias",
    timestamps: true,
  }
);
