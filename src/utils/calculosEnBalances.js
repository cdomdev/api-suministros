

export const calculosDeBalances = (ordersList) => {

    let totalShipped = [];
    let totalPending = [];
    let totalVendido = 0;

    for (const order of ordersList) {
        totalVendido += parseFloat(order.pago_total);
        if (order.estado_pedido === "entregado") {
            totalShipped.push(order)
        }else{
            totalPending.push(order);
        }
    }

    return {
        totalVendido,
        totalPending,
        totalShipped
    }
}