

export const calculosDeBalances = (ordersList) => {

    if (!Array.isArray(ordersList)) {
        throw new Error("ordersList debe ser un array");
    }

    let totalShipped = [];
    let totalPending = [];
    let totalVendido = 0;

    // Bucle para calcular valores
    for (const order of ordersList) {
        totalVendido += isNaN(parseFloat(order.pago_total)) ? 0 : parseFloat(order.pago_total);

        if (order.estado_pedido === "entregado") {
            totalShipped.push(order);
        } else {
            totalPending.push(order);
        }
    }

    return {
        totalVendido,
        totalPending,
        totalShipped
    };
}