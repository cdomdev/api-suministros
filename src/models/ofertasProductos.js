import { DataTypes } from "sequelize";
import { conecction } from "../../database/conecction.js";

export const OfertasProductos = conecction.define(
  "productos_ofertas",
  {
    id_ofertas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    id_productos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "productos_ofertas",
    timestamps: false,
  }
);
