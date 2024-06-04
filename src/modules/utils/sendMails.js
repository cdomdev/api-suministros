import nodemailer from 'nodemailer';

const USER_MAIL = process.env.USER_FROM_MAILS;
const PASS_MAILS = process.env.PASS_FOR_MAILS;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: USER_MAIL,
    pass: PASS_MAILS,
  }
});

const sendMail = async (destinatario, asunto, contenido) => {
  try {
    // Define la información del correo electrónico
    const mailOptions = {
      from: USER_MAIL,
      to: destinatario,
      subject: asunto,
      html: contenido
    };

    // Envía el correo electrónico
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
  }
};

export default sendMail;
