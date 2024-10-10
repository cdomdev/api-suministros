import { DataTypes } from "sequelize";
import { conecction } from "../../database/conecction.js";

export const Roles = conecction.define(
  "roles",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    rol_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);
