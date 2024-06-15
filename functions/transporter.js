import nodemailer from "nodemailer";
const USER_MAIL = process.env.USER_FROM_MAILS;
const PASS_MAILS = process.env.PASS_FOR_MAILS;

// Configuración del transporte de correos
export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: USER_MAIL,
    pass: PASS_MAILS,
  },
});

// Configuración común para el envío de correos
export const mailOptionsBase = {
  from: '"Suministros" <youremail@gmail.com>',
  attachments: [
    { filename: "fb.png", path: "./public/images//fb.png", cid: "fb" },
    { filename: "ig.png", path: "./public/images/ig.png", cid: "ig" },
    { filename: "wapp.png", path: "./public/images//wapp.png", cid: "wapp" },
    { filename: "em.png", path: "./public/images/em.png", cid: "em" },
  ],
};
