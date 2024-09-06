import moment from "moment";
import { Productos, Ofertas, Inventario } from "../../models/index.js";

export const crearOfetas = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Acceso no autorizado" });
  }
  // cuerpo de la oferta
  const { nombre, descuento, productos, fechaIni, fechaFin } = req.body;

  //  formetaer fechas dia-mes-anio
  const fechaInicio = moment(fechaIni, "DD-MM-YYYY").format("YYYY-MM-DD");
  const fechaFinal = moment(fechaFin, "DD-MM-YYYY").format("YYYY-MM-DD");

  // aregar el valor de las ofertas a cada producto

  if (productos && productos.length > 0) {
    for (const id of productos) {
      await Productos.update({ discount: descuento }, { where: { id: id } });
    }
  }

  //   crear la oferta
  try {
    const nuevaOferta = await Ofertas.create({
      nombre,
      descuento,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFinal,
    });

    // asociar los productos selcionados a la nueva oferta
    if (productos && productos.length > 0) {
      await nuevaOferta.addProductos(productos);
    }
    const nuevasOfertas = await Ofertas.findAll({
      include: {
        model: Productos,
        attributes: ["id", "nombre", "marca", "description", "referencia"],
        through: "productos_ofertas",
      },
    });

    return res
      .status(201)
      .json({ message: "Oferta creada con éxito", ofertas: nuevasOfertas });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al crear la oferta", error: error.message });
  }
};

// obtener datos necesarios para relacion entre productos y ofertas
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Productos.findAll({
      attributes: ["id", "marca", "nombre"],
      include: [
        {
          model: Inventario,
          attributes: ["cantidad"],
        },
      ],
    });
    res
      .status(200)
      .json({ message: "Productos obtenidos con éxito", data: productos });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
};

export const obtenerOfertasConProductos = async (req, res) => {
  try {
    const ofertas = await Ofertas.findAll({
      include: {
        model: Productos,
        attributes: ["id", "marca", "nombre", "referencia"],
        through: "productos_ofertas",
      },
    });

    if (!ofertas) {
      return res.status(400).json({ message: "Oferta no encontrada" });
    }
    return res.status(200).json({ ofertas });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al obtener la oferta" });
  }
};

// elimar ofertas

export const eliminarOferta = async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Acceso no autorizado" });
  }

  try {
    const ofertaAElminar = await Ofertas.findByPk(id);

    if (!ofertaAElminar) {
      return res.status(400).json({ message: "Oferta no encontrada" });
    }

    await ofertaAElminar.removeProductos(id);
    await ofertaAElminar.destroy();

    const ofertas = await Ofertas.findAll({
      include: {
        model: Productos,
        attributes: ["id", "nombre", "marca", "description", "referencia"],
        through: "productos_ofertas",
      },
    });

    return res.status(200).json({
      message: "OK",
      ofertas,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al eliminar la oferta" });
  }
};

// actulizar
export const actulizarOfertas = async (req, res) => {
  const { updatedValues } = req.body;
  const { id } = req.params;
  const { nombre, descuento, fechaIni, fechaFin } = updatedValues;

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Acceso no autorizado" });
  }

  const fecha_inicio = fechaIni;
  const fecha_fin = fechaFin;

  try {
    const ofertaUpdate = await Ofertas.findOne({ where: { id } });
    if (ofertaUpdate) {
      await Ofertas.update(
        { nombre, descuento, fecha_inicio, fecha_fin },
        { where: { id } }
      );

      const ofertas = await Ofertas.findAll({
        include: {
          model: Productos,
          attributes: ["id", "nombre", "marca", "description", "referencia"],
          through: "productos_ofertas",
        },
      });
      if (ofertas) {
        return res.status(200).json({
          message: "Ok",
          ofertas,
        });
      }
    } else {
      return res.status(404).json({
        message: "No se encontró regitro de la oferta.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Hubo un error al actualizar la oferta.",
    });
  }
};
