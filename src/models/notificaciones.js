import { DataTypes } from "sequelize";
import { conecction } from "../../database/conecction.js";

export const Notifcaciones = conecction.define(
  "notificaciones",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    mensaje: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "notificaciones",
    timestamps: true,
  }
);
