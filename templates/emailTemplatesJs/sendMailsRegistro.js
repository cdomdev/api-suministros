import { transporter, mailOptionsBase } from "../../src/helpers/transporter.js";

// Función para enviar correo de notificación
export function sendMailsRegistro(nombre, email) {
  // Definir las notificaciones
  const notificaciones = [
    // Registro
    {
      subject: "Nuevo registro",
      titulo: `¡Bienvenido(a) ${nombre}! Gracias por tu registro`,
      mensaje: "Visita nuestra tienda y realiza tu primera compra",
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
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            font-family: 'Roboto', sans-serif !important;
        }
    </style>
</head>

<body>

    <div class="container" style="  width: 100%; background-color: #e3e3e3;">
        <div style=" padding: 20px 10px;">
            <!-- Encabezado -->
            <div style="background-color: #283765; padding: 10px 0px 10px 0px; width: 100%; text-align: center;">
                <h1
                    style="color: white; font-family: roboto; font-weight: 700; font-size: 28px; margin: 10px 0px 10px 0px;">
                    SUMINISTROS</h1>
            </div>
            <!-- Encabezado -->

            <div style="background-color: #ffffff; padding: 2px 0px 30px 0px; width: 100%; text-align: center;">
                <h2>¡Hola ${nombre}!</h2>
                <hr style="width: 90%; margin: auto;">
                <h4>Te damos la bienvenida a nuestra tienda virtual, un espacio diseñado para que realices tus
                    compras sin moverte de donde estes.</h4>
                <p style="margin: 0px 0px 40px 0px;">Visita nuetras tienda y realiza tu primera compra</p>

                <!-- Botón -->
                <a href="http://localhost:5173/suministros/home" class="btn-recover" style="width: 10%;;
                align-self: center;
                background-color:#088ec8 ;
                border: solid 1px #cccc;
                padding: 10px 25px 10px 25px;
                color: white;
                text-decoration: none;
                font-size: 15px;
                list-style: none;
                border-radius: 5px;">Ir a la tienda</a>

                <div
                    style="border:solid; border-style: dashed; width: 90%; margin: 2em auto 2em auto; padding: 0  10px 10px 10px;">
                    <p style="background-color: #e3e3e3; padding: 10px ;">
                        Esta es una notificación automática, por favor no responda este mensaje
                    </p>
                    <span>
                        Comuníquese con nuestra lienas 320121212 o al resto de país al
                        01 8000 9311423 en caso de recibir una alerta o notificación de una compra que presenta
                        alguna
                        irregularidad.

                    </span>
                </div>
            </div>

            <!-- Contenido principal -->

            <!-- footere -->
            <div
                style="background-color: #283765; color: #ffffff; padding: 20px 0px 0px 0px; width: 100%; text-align: center;">
                <!-- Redes sociales -->
                <a href="https://www.facebook.com/pretwor" class="contA" style=" margin: 0px 5px 0 5px;"><img
                        src="cid:fb" class="imag" style="  width: 20px;
                 height: 20px;
                 align-self: center;" /></a>
                <a href="https://www.instagram.com/pretwor/" class="contA" style=" margin: 0px 5px 0 5px;"><img
                        src="cid:ig" class="imag" style="  width: 20px;
                 height: 20px;
                 align-self: center;" /></a>
                <a href="https://wa.me/573224294332" class="contA" style=" margin: 0px 5px 0 5px;"><img src="cid:wapp"
                        class="imag" style="  width: 20px;
                 height: 20px;
                 align-self: center;" /></a>
                <a href="mailto:contacto@pretwor.com" class="contA" style=" margin: 0px 5px 0 5px;"><img src="cid:em"
                        class="imag" style="  width: 20px;
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
    text: notificaciones[0].notificacion,
    html: mensajeHtml,
  };

  // Verificar conexión y enviar correo
  transporter
    .verify()
    .then(() => {
      return transporter.sendMail(mailOptions);
    })
    .then((info) => {
      console.log("Correo enviado con exito");
    })
    .catch((error) => {
      console.error("Error al enviar correo:", error);
    });
}
