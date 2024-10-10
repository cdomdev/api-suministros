import { DataTypes } from "sequelize";
import { conecction } from "../../database/conecction.js";

// modelo de ofertas
export const Ofertas = conecction.define(
  "ofertas",
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
          msg: "El nombre es requerido",
        },
      },
    },
    descuento: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo porcentaje es requerido",
        },
      },
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo fecha inicio es requerido",
        },
      },
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo fecha fin es requerido",
        },
      },
    },
  },
  {
    tableName: "ofertas",
    timestamps: false,
  }
);
