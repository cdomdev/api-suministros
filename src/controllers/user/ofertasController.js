import { getproductOfOferts } from '../../helpers/userHelpers/ofertasHelpers.js'
import { NotFountError, ErrorServer } from '../../helpers/errorsInstances.js';


export const listarOfertasConProductos = async (req, res) => {
  try {

    const ofertas = await getproductOfOferts()

    return res.status(200).json({ productos: ofertas });

  } catch (error) {
    console.error(
      "Error al obtener los productos con ofertas:",
      error
    );
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};
