import { NotFountError, ErrorServer } from "../../helpers/errorsInstances.js";
import { handleMerchantOrderNotification, handlePaymentNotification } from "../../helpers/userHelpers/getDataPaymentMercadoPagoHelper.js";

export const reciveWebhook = async (req, res) => {
  try {
    if (req.body.type === "payment") {
      await handlePaymentNotification(req.body);
      return res.status(200);
    } else if (req.body.topic === "merchant_order") {
      await handleMerchantOrderNotification(req.body);
      return res.status(200);
    } else {
      throw new NotFountError(`Error al procesar el weebhook`)
    }
  } catch (error) {
    console.error("Error al intentar obtener datos del pago en el webhook:" + error);
    if (error instanceof NotFountError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ error: new ErrorServer().message });
  }
};

