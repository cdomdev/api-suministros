import { DataTypes } from "sequelize";
import { conecction } from "../../database/conecction.js";
import { Pedido, Roles } from "./index.js";

export const User = conecction.define(
  "usuarios",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    detalles: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);
