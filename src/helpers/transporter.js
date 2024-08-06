import nodemailer from "nodemailer";
const USER_MAIL = process.env.USER_FROM_MAILS;
const PASS_MAILS = process.env.PASS_FOR_MAILS;
import path from "path";
import { fileURLToPath } from "url";

// Configuración del transporte de correos
export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: USER_MAIL,
    pass: PASS_MAILS,
  },
});

// Obtener __dirname en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración común para el envío de correos
export const mailOptionsBase = {
  from: '"Suministros" <youremail@gmail.com>',
  attachments: [
    {
      filename: "fb.png",
      path: path.join(__dirname, "../../public/images/fb.png"),
      cid: "fb", // Content-ID para referenciar la imagen en el HTML
    },
    {
      filename: "ig.png",
      path: path.join(__dirname, "../../public/images/ig.png"),
      cid: "ig",
    },
    {
      filename: "wapp.png",
      path: path.join(__dirname, "../../public/images/wapp.png"),
      cid: "wapp",
    },
    {
      filename: "em.png",
      path: path.join(__dirname, "../../public/images/em.png"),
      cid: "em",
    },
  ],
};
