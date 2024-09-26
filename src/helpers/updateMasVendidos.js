import { Productos } from "../models/index.js";

export const updateMasVendidos = async (productos) => {
    try {
        for (const producto of productos) {
            await Productos.update(
                { sales_count: producto.sales_count + 1 },
                { where: { id: producto.id } }
            );
        }
    } catch (error) {
        throw new Error('Error al actulzar datos de mas vendidos', error.message)
    }


}