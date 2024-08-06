import { MercadoPagoConfig } from "mercadopago";

const mercadopagoToken = process.env.VITE_ACCESS_TOKEN_MERCADOPAGO;

// Configura las credenciales de Mercado Pago
export const client = new MercadoPagoConfig({
  accessToken: mercadopagoToken,
});
