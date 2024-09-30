export const aplicarDescuento = (producto) => {
    if (producto.valor > 0) {
        let valorDescuento = producto.valor - (producto.valor * (producto.discount / 100))
        return Number(valorDescuento)
    } else {
        return Number(producto.valor)
    }

}