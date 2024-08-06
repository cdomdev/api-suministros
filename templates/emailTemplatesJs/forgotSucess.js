import { transporter, mailOptionsBase } from "../../src/helpers/transporter.js";

// Función para enviar correo de notificación
export function sendMailForgotSucess(nombre, email) {
  // Definir las notificaciones
  const notificaciones = [
    // compra
    // Notificacion para usuario
    {
      subject: `Camvio de contraseña exitoso`,
      titulo: `¡Hola ${nombre}, tu contraseña se actulizado con exito ! `,
      mensaje: `Si no fuiste tu quien realizo el cambio de contraseña, comunicate a nuestra linea de atencion para brindarte ayuda`,
    },
    // notificaion para administrador
    {
      subject: "Nueva compra",
      titulo: `¡Se realizo una nueva compra a nombre de ${nombre}!`,
      mensaje: `Hola Admin , el usuario ${nombre} realizo nuevo pedido`,
    },
    // Correo programado
    {
      subject: "Correo programado",
      titulo: "Correo programado",
      mensaje:
        "Este correo ha sido enviado debido a una programación con node-cron.",
    },
  ];

  // Construir el contenido HTML del correo
  const mensajeHtml = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cambio exitoso</title>
      <style>
          * {
              font-family: 'Roboto', sans-serif !important;
          }
      </style>
  </head>
  
  <body>
      <div class="container" style="width: 100%; background-color: #e3e3e3;">
          <div style=" padding: 20px 10px;">
              <!-- Encabezado -->
              <div style="background-color: #283765; padding: 10px 0px 10px 0px; width: 100%; text-align: center;">
                  <!-- <img src="cid:logo" alt="img" style="width: 180px; height: 31px;"> -->
                  <h1
                      style="color: white; font-family: roboto; font-weight: 700; font-size: 28px; margin: 10px 0px 10px 0px;">
                      SUMINISTROS</h1>
              </div>
              <!-- Encabezado -->
  
              <!-- Contenido principal -->
              <div style="padding: 30px 0px 25px 0px;
              width: 100%; 
              text-align: center;
              gap: 10px; background-color: white;">
  
                  <h2 style="font-size: 20px; margin: 0px 0px 1em 0px;">¡Hola ${nombre}, tu contraseña se actualizo con
                      exito!</h2>
                  <hr style="width: 95%; margin: auto;">
                  <div style="border: solid; border-style: dashed; width: 90%; margin: 2em auto 2em auto ; padding: 10px;">
                      <div style="background-color: #e3e3e3; padding: 2px 0 2px 0;;">
                          <h3> ¿No reconoce esta actividad?</h3>
                      </div>
                      <p> Tal vez la seguridad de su cuenta se ha visto comprometida.</p>
                      <p> Su seguridad es fundamental para nosotros y queremos garantizar que esté informado
                          cuando se tomen medidas importante. Si realizo el cambio de contraseña, comuniquece a nuestra
                          linea de atencion para
                          brindarte ayuda.</p>
                      <a href="mailto:dominguez5493.cd@gmail.com";">soporteSumi@sumi.com</a>
                  </div>
                  <p style="font-size: 14px; margin: 10px 0em 2em 0em; text-wrap: wrap; line-height: 19px;">
  
                  </p>
  
  
              </div>
  
              <!-- footere -->
              <div
                  style="background-color: #283765; color: #ffffff; padding: 20px 0px 0px 0px; width: 100%; text-align: center;">
                  <!-- Redes sociales -->
                  <a href="https://www.facebook.com/pretwor" style=" margin: 0px 5px 0 5px;"><img src="cid:fb" style=" width: 20px;
                      height: 20px;
                      align-self: center;" /></a>
                  <a href="https://www.instagram.com/pretwor/" style=" margin: 0px 5px 0 5px;"><img src="cid:ig" style=" width: 20px;
                          height: 20px;
                          align-self: center;" /></a>
                  <a href="https://wa.me/573224294332" style=" margin: 0px 5px 0 5px;"><img src="cid:wapp" style=" width: 20px;
                          height: 20px;
                          align-self: center;" /></a>
                  <a href="mailto:contacto@pretwor.com" style=" margin: 0px 5px 0 5px;"><img src="cid:em" style=" width: 20px;
                          height: 20px;
                          align-self: center;" /></a>
  
  
                  <!-- Redes sociales -->
  
                  <h4 style="font-weight: 500;">¡ Si tienes alguna duda !</h4>
                  <p style="font-size: 13px; padding: 0px 20px;">
                      Comunícate con nosotros por los siguientes medios:<br>
                      Correo: <a class="afooter" style=" color: white;
                      text-decoration: none;
                      font-size: 13px !important;" href="mailto:soporte@suministros.com">soporte@suministros.com</a><br>
                      Whatsapp: <a class="afooter" style=" color: white;
                      text-decoration: none;
                      font-size: 13px !important;" href="https://wa.me/573224294332">+57 3208132304</a><br>
                  </p>
                  <p
                      style="background-color: rgb(67, 65, 65); padding: 10px 0px; font-size: 13px !important; text-transform: uppercase;">
                      Suministros
                  </p>
              </div>
          </div>
      </div>
  </body>
  
  </html>
  `;

  // Configuración del correo
  const mailOptions = {
    ...mailOptionsBase,
    to: email,
    subject: notificaciones[0].subject,
    text: notificaciones[0].titulo,
    html: mensajeHtml,
  };

  // Verificar conexión y enviar correo
  transporter
    .verify()
    .then(() => {
      return transporter.sendMail(mailOptions);
    })
    .then((info) => {
      console.log("Correo enviado:", info);
    })
    .catch((error) => {
      console.error("Error al enviar correo:", error);
    });
}
