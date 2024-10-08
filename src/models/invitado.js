import { DataTypes } from "sequelize";
import { conecction } from "../../database/conecction.js";

export const Invitado = conecction.define(
  "invitado",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detalles: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "invitado",
    timestamps: false,
  }
);
