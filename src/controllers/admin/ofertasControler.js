import { ErrorServer, NotFountError, MissingDataError } from "../../helpers/errorsInstances.js";
import { deleteOfertasBy, getAllOfertas, getProductsForOferta, newOferta, updateOfertaBy } from "../../helpers/adminHelpers/ofertasHelpers.js";


export const crearOfetas = async (req, res) => {

  const { nombre, descuento, productos, fechaIni, fechaFin } = req.body;

  try {

    const nuevasOfertas = await newOferta(nombre, descuento, productos, fechaIni, fechaFin)

    return res
      .status(201)
      .json({ message: "Oferta creada con éxito", ofertas: nuevasOfertas });


  } catch (error) {
    console.log('"Error al crear la oferta"', error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};


export const obtenerProductos = async (req, res) => {
  try {

    const productos = await getProductsForOferta()

    res
      .status(200)
      .json({ message: "Productos obtenidos con éxito", data: productos });


  } catch (error) {
    console.log('Error al listar los productos para las ofertas', error);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};


export const obtenerOfertasConProductos = async (req, res) => {
  try {

    const ofertas = await getAllOfertas()

    return res.status(200).json({ ofertas });
  } catch (error) {
    console.log('Error al listar las ofertas', error);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};



export const eliminarOferta = async (req, res) => {
  const { id } = req.params;

  try {

    const ofertas = await deleteOfertasBy(id)

    return res.status(200).json({
      message: "OK",
      ofertas,
    });

  } catch (error) {
    console.log('Error al eliminar la oferta', error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};


export const actulizarOfertas = async (req, res) => {
  const { updatedValues } = req.body;
  const { id } = req.params;
  try {

    const ofertas = await updateOfertaBy(id, updatedValues)

    res.status(200).json({
      message: "Ok",
      ofertas,
    });


  } catch (error) {
    console.log('Hubo un error al intentar actualizar la oferta', error);
    if (error instanceof MissingDataError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ mensaje: error.message })
    } else {
      return res.status(500).json({ error: new ErrorServer().message });
    }
  }
};
