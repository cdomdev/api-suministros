export const createItemsMercadoPago = (productos, costoEnvio) => {
  // Construir el array de items para Mercado Pago
  const mercadoPagoItems = productos.map((item) => ({
    title: item.nombre,
    quantity: item.quantity,
    unit_price: aplicarDescuento(item)
  }));

  // Agregar el envío como un solo item al array de items para Mercado Pago
  if (costoEnvio > 0) {
    mercadoPagoItems.push({
      title: "Costo de envío",
      quantity: 1,
      unit_price: costoEnvio,
    });
  }
  return mercadoPagoItems;
};


const aplicarDescuento = (producto) => {
  if (producto.valor > 0) {
    let valorDescuento = producto.valor - (producto.valor * (producto.discount / 100))
    return Number(valorDescuento)
  } else {
    return Number(producto.valor)
  }

}