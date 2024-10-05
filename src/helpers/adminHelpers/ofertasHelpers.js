import moment from 'moment'
import { Productos, Ofertas, Inventario } from '../../models/index.js';
import { NotFountError, MissingDataError } from '../errorsInstances.js';

export const getAllOfertas = async () => {
    try {
        const ofertas = await Ofertas.findAll({
            include: {
                model: Productos,
                attributes: ["id", "nombre", "marca", "description", "referencia"],
                through: "productos_ofertas",
            },
        });

        return ofertas
    } catch (error) {
        throw error
    }
}

export const newOferta = async (nombre, descuento, productos, fechaIni, fechaFin) => {
    const fechaInicio = moment(fechaIni, "DD-MM-YYYY").format("YYYY-MM-DD");
    const fechaFinal = moment(fechaFin, "DD-MM-YYYY").format("YYYY-MM-DD");

    try {

        if (!nombre || !descuento || !productos || !fechaIni || !fechaFin) {
            throw new MissingDataError('Faltan datos para crear la oferta')
        }

        await updateDescuento(productos, descuento)

        const nuevaOferta = await Ofertas.create({
            nombre,
            descuento,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFinal,
        });

        // asociar los productos selcionados a la nueva oferta
        await nuevaOferta.addProductos(productos);

        const ofertas = await getAllOfertas()

        return ofertas

    } catch (error) {
        throw error
    }
}


export const updateDescuento = async (productos, descuento) => {
    try {
        if (productos && productos.length > 0) {
            for (const id of productos) {
                await Productos.update({ discount: descuento }, { where: { id: id } });
            }
        } else {
            throw new NotFountError('Hubo un error en la actualizacion del descuento en los productos')
        }

    } catch (error) {
        console.log('Hubo un error en la actualizacion del descuento en los productos' + error.message)
        throw error
    }
}

export const getProductsForOferta = async () => {
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

        return productos

    } catch (error) {
        throw error
    }
}

export const deleteOfertasBy = async (id) => {
    try {

        if (!id) {
            throw new MissingDataError('Se require de un id para eliminar un producto')
        }

        const ofertaAElminar = await Ofertas.findByPk(id);

        if (!ofertaAElminar) {
            throw new NotFountError('Oferta no encontrada')
        }

        await ofertaAElminar.removeProductos(id);
        await ofertaAElminar.destroy();

        const ofertas = await getAllOfertas()

        return ofertas
    } catch (error) {
        throw error
    }
}

export const updateOfertaBy = async (id, updatedValues) => {
    const { nombre, descuento, fechaIni, fechaFin } = updatedValues;

    const fecha_inicio = fechaIni;
    const fecha_fin = fechaFin;

    try {

        if (!updatedValues || !id) {
            throw new MissingDataError('Faltan datos para actulizar la oferta')
        }

        const ofertaUpdate = await Ofertas.findOne({ where: { id } });

        if (!ofertaUpdate) {
            throw new NotFountError('Oferta no encontrada')
        }

        await Ofertas.update(
            { nombre, descuento, fecha_inicio, fecha_fin },
            { where: { id } }
        );

        const ofertas = await getAllOfertas()

        return ofertas

    } catch (error) {
        throw error
    }
}