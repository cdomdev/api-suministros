// Calcula el valor con descuento y lo devuelve con dos decimales
export const calcularDescuentoParaTotal = (valor, discount) => {
  const valorNumerico = parseFloat(valor);
  const descuentoAplicado = valorNumerico - (valorNumerico * (discount / 100));
  return parseFloat(descuentoAplicado.toFixed(2));
};

// Calcula el total sumando productos con o sin descuento
export const calcularTotal = (productos) => {
  if (!Array.isArray(productos) || productos.length === 0) {
    return 0;
  }

  return productos.reduce((total, producto) => {
    const cantidad = producto.quantity || 0;
    const valor = parseFloat(producto.valor);

    let valorFinal = valor;
    // Si tiene descuento, calcula el valor con descuento
    if (producto.discount && producto.discount > 0) {
      valorFinal = calcularDescuentoParaTotal(valor, producto.discount);
    }

    // Sumar el valor final multiplicado por la cantidad al total
    return total + (valorFinal * cantidad);
  }, 0);
};



export const calcularCantidad = (productos) => {
  let cantidadTotal = 0;
  for (const producto of productos) {
    cantidadTotal += producto.cantidad;
  }
  return cantidadTotal;
};

export const subTotal = (producto) => {
  let subTotalValue = 0;

  if (producto.discount > 0) {
    const descuento = (parseFloat(producto.valor) * producto.discount) / 100;
    subTotalValue = (parseFloat(producto.valor) - descuento) * producto.quantity;
  } else {
    subTotalValue = parseFloat(producto.valor) * producto.quantity;
  }

  return subTotalValue;
};
