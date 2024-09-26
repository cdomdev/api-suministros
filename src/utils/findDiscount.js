export const validarDescuento = (producto) => {
    if (producto.discount > 0) {
        let descuento = (parseFloat(producto.valor) * producto.discount) / 100
        return producto.valor - descuento
    } else {
        return producto.valor
    }
}
