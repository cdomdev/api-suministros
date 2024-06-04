import  { DataTypes, }  from "sequelize";
import { conecction } from "../../database/conecction.js";

export const Productos = conecction.define(
  "Productos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
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
       len:[0, 1000]
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
    categoria_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categoria",
        key: "id",
      },
    },
    categoria_padre_id: {
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

export const CategoriaPadre = conecction.define(
  "categoria_padre",
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
    tableName: "categoria_padre",
    timestamps: true,
  }
);

// modelo de las subcategorias
export const Categoria = conecction.define(
  "Categoria",
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
    tableName: "Categoria",
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
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    metodo_pago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    invitado_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estado:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    preference_id:{
      type: DataTypes.STRING,
      allowNull: true,
    }
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
    descuento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "detalles_pedido",
    timestamps: true,
  }
);


//------ Relaciones entre modelos ------

// productos - categorias
Productos.belongsTo(Categoria, { foreignKey: "categoria_id" });


// Establecer la relación entre productos y categoría padre
Productos.belongsTo(CategoriaPadre, { foreignKey: 'categoria_padre_id' });



// categoria - productos 
Categoria.hasMany(Productos, {foreignKey: 'categoria_id'})

// relacion invetario y porductos
Productos.hasMany(Inventario, { foreignKey: "producto_Id" });

// productos - tabla intermediara de ofertas
Productos.belongsToMany(Ofertas, {
  through: "productos_ofertas",
  foreignKey: "id_productos",
  onDelete: 'CASCADE'
});

// relacion pedido - detalles pedido
Pedido.hasMany(DetallesPedido, { foreignKey: 'pedido_id' });

DetallesPedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });


// pedidos - usuarios

// Pedido.belongsTo(User, { foreignKey: 'usuario_id' });

// // peidos - invitados
//  Pedido.belongsTo(Invitado, {foreignKey: 'invitado_id'})

// detalles_pedidos - productos
DetallesPedido.belongsTo(Productos, { foreignKey: 'producto_id' });

// productos - detalles_pedidos 
Productos.hasMany(DetallesPedido, { foreignKey: 'producto_id' });

// relacion pedidos - detalles de pedido
DetallesPedido.belongsTo(Pedido, { foreignKey: "pedido_id" });

// relacion entre  pedidos - productos  
Pedido.belongsTo(Productos, { foreignKey: 'producto_id' });

// relacion entre productos -  pedidos  
Productos.hasMany(Pedido, { foreignKey: 'producto_id' });

// tabla intermedia con relacion entre productos y ofertas
Ofertas.belongsToMany(Productos, {
  through: "productos_ofertas",
  foreignKey: "id_ofertas",
  onDelete: 'CASCADE'
});

