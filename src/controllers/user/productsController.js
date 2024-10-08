import { findProducts, getProducts, getProductBy, getMoreSalled } from "../../helpers/userHelpers/productosHelper.js";
import { ErrorServer, NotFountError } from '../../helpers/errorsInstances.js'


export const listarProductos = async (req, res) => {
  try {

    const productos = await getProducts()

    res.json({ productos: productos });

  } catch (e) {
    console.error("Error al obtener el lisatdo de productos:", error);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};



export const buscarProductos = async (req, res) => {
  const { query } = req.body;
  try {

    const resultados = await findProducts(query)

    return res
      .status(200)
      .json({ resultados: resultados });

  } catch (error) {
    console.error("Error al obtener el lisatdo de productos:", error);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};



export const masVendidos = async (req, res) => {
  try {

    const productos = await getMoreSalled();

    return res.status(200).json({ productos: productos });
  } catch (error) {
    console.log("Error al obtener las lista de productos mas vendidos", error);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};



export const listarProductoID = async (req, res) => {
  const { id } = req.params;

  try {

    const producto = await getProductBy(id)

    res.status(200).json({ producto });

  } catch (error) {
    console.error("Error al obtener el producto por su id:", error);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};