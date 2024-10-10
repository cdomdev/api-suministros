import { DataTypes } from "sequelize";
import { conecction } from "../../database/conecction.js";

export const Categorias = conecction.define(
  "categorias",
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
    tableName: "categorias",
    timestamps: true,
  }
);
