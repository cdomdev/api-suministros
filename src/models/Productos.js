import { DataTypes } from "sequelize";
import { conecction } from "../../database/conecction.js";


export const Productos = conecction.define(
  "Productos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El title es requerido",
        },
      },
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
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo valor es requerido",
        },
        min: {
          args: [0],
          msg: "El valor debe ser un número positivo",
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo descripcion es requerido",
        },
      },
      len: [0, 1000],
    },
    referencia: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo referencia es requerido",
        },
      },
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categorias",
        key: "id",
      },
    },
    subcategoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La ruta de la imagen es requerida",
        },
      },
    },
    sales_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Productos",
    timestamps: true,
  }
);
