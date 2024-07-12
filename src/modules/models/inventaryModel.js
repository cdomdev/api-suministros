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
  },
  {
    tableName: "Productos",
    timestamps: true,
  }
);

// Modelo  para la tabla inventario

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

// Modelo de categorias

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

// modeo de relacion entre productos y ofertas

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

// modelo de pedidos
export const Pedido = conecction.define(
  "pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    invitado_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "pedido",
    timestamps: false,
  }
);

// modelo de detalles pedidos
export const DetallesPedido = conecction.define(
  "detalles_pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sub_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_pago: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    costo_de_envio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado_pedido: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metodo_pago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descuento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status_detail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "detalles_pedido",
    timestamps: true,
  }
);

//------ Relaciones entre modelos ------
// Relación pedido - detalles pedido
Pedido.hasMany(DetallesPedido, {
  as: "detalles_pedido",
  foreignKey: "pedido_id",
});

DetallesPedido.belongsTo(Pedido, { foreignKey: "pedido_id" });

// detalles_pedidos - productos
DetallesPedido.belongsTo(Productos, { foreignKey: "producto_id" });

// productos - detalles_pedidos
Productos.hasMany(DetallesPedido, { foreignKey: "producto_id" });

// productos - categorias
Productos.belongsTo(Categorias, { foreignKey: "categoria_id" });
Categorias.hasMany(Productos, { foreignKey: "categoria_id" });

// productos - subcategorias
Productos.belongsTo(Subcategorias, { foreignKey: "subcategoria_id" });
Subcategorias.hasMany(Productos, { foreignKey: "subcategoria_id" });

// productos - inventario
Productos.hasMany(Inventario, { foreignKey: "producto_Id" });

// productos - tabla intermediaria de ofertas
Productos.belongsToMany(Ofertas, {
  through: "productos_ofertas",
  foreignKey: "id_productos",
  onDelete: "CASCADE",
});
Ofertas.belongsToMany(Productos, {
  through: "productos_ofertas",
  foreignKey: "id_ofertas",
  onDelete: "CASCADE",
});
