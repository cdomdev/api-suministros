import {
  handleMerchantOrderNotification,
  handlePaymentNotification,
} from "../../utils/itesmProcessMercadoPago.js";
import path from "path";

export const reciveWebhook = async (req, res) => {
  try {
    if (req.body.type === "payment") {
      await handlePaymentNotification(req.body, res);
      return res.status(200);
    } else if (req.body.topic === "merchant_order") {
      await handleMerchantOrderNotification(req.body, res);
      return res.status(200);
    } else {
      // Responde con un estado que indique que no has procesado el webhook
      return res.status(400).send("Webhook not processed");
    }
  } catch (error) {
    console.error("Error en el manejo del webhook:", error.message);
    return res.sendStatus(500);
  }
};

const __dirname = path.resolve();

export const feedBack = async (req, res) => {
  try {
    const templatesPath = path.join(
      __dirname,
      "Api/src/modules/public/html/success.html"
    );
    res.sendFile(templatesPath);
  } catch (error) {
    console.error("Error al enviar el archivo:", error);
    res.status(500).send("Error interno del servidor");
  }
};
