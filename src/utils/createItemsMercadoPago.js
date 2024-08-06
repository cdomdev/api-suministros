export const createItemsMercadoPago = (cartItems, costoEnvio) => {
  // Construir el array de items para Mercado Pago
  const mercadoPagoItems = cartItems.map((item) => ({
    title: item.nombre,
    quantity: item.cantidad,
    unit_price: Number(item.valor),
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
