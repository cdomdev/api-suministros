import { formateValue } from "./formateValue.js";
import { calcularTotal } from "../src/modules/utils/valoresDeProductos.js";
import { transporter, mailOptionsBase } from "./transporter.js";

// Función para enviar correo de notificación
export function sendMailsCompraMercadoPago(
  cualNotificacion,
  usuario,
  productos,
  costoEnvio
) {
  // Definir las notificaciones
  const notificaciones = [
    // compra
    // Notificacion para usuario
    {
      subject: `Nueva compra`,
      titulo: `¡Hola ${
        usuario.nombre || usuario.name
      }, tu compra fue realizada con exito ! `,
      mensaje: `Acontinuacion un resumen de tu pedido`,
    },
    // notificaion para administrador
    {
      subject: "Nueva compra",
      titulo: `¡Se realizo una nueva compra a nombre de ${
        usuario.nombre || usuario.name
      }!`,
      mensaje: `Hola Admin , el usuario ${
        usuario.nombre || usuario.name
      } realizo nuevo pedido`,
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
  
              <!-- Contenido principal -->
              <div style="background-color: #ffffff; padding: 5px 0px 25px 0px; width: 100%; text-align: center;;">
                 <h2 style="max-inline-size: 75%; margin: 20px auto 20px auto;">Hola ${
                   usuario.nombre || usuario.name
                 }, aqui esta un detalle de tu pedido</h2>
                  <hr style="width: 90%; margin: auto;">
                <p style="font-weight: bold; max-inline-size: 50% !important; margin: 5px auto 0px auto;">
                    Su compra atraves de marcado pago fue validada. <br> tenga en cuenta lo siguiente
                </p>
                <div style="width: 80%; margin: auto;">
                    <ul style="list-style:circle; text-align: left;line-height: 25px; padding: 0;">
                        <li>Asegúrace de validar sus datos antes de confirmar la compra</li>
                        <li>En caso de que no puedas estar en su vivienda en el momento de la entrega, puede dejar
                            encargada a otra persona par que reciba su pedido</li>
                        <li>Las compra realizadas a traves de mercado pago llevan un proceso de validacion por su entidad finaciera,
                         si se presenta algun inconvenientes en el proceso, suministros se reserva el derecho de cancelar su pedidio.</li>
                    </ul>
                </div>
  

                  <p style="font-weight: bold;"">Acotinuacion un resumen de tu pedido</p>
                  <!-- Detalles del pedido -->
                  <div style=" width: 80%; margin: 2em auto 2em auto;">
                      <!-- Otros detalles del pedido -->
                      <table style="border-collapse: collapse; border: 2px solid #ccc; margin: auto; width: 100%;">
                          <thead style="background-color: #818ba9;">
                              <tr>
                                  <th style="border: 1px solid #ccc; padding: 8px;">Productos</th>
                                   <th style="border: 1px solid #ccc; padding: 8px;">Cantidad</th>
                                   <th style="border: 1px solid #ccc; padding: 8px;">Costo de envio</th>
                                  <th style="border: 1px solid #ccc; padding: 8px;">Valor</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${productos
                                .map(
                                  (producto) => `
                              <tr>
                                  <td style="border: 1px solid  #ccc;">${
                                    producto.nombre
                                  }</td>
                                  <td style="border: 1px solid #ccc;">${
                                    producto.cantidad
                                  } U.N</td>
                                   <td style="border: 1px solid #ccc;">${formateValue(
                                     costoEnvio
                                   )}</td>
                                  <td style="border: 1px solid #ccc;">${formateValue(
                                    parseInt(producto.valor)
                                  )}</td>
                              </tr>
                              `
                                )
                                .join("")}
                          </tbody>
                          <tfoot>
                              <tr>
                                  <td colspan="4"
                                      style="border: 1px solid #ccc; padding: 8px; font-weight: bold; text-align: center;">
                                      Total:
                                      ${formateValue(
                                        parseInt(
                                          calcularTotal(productos) + costoEnvio
                                        )
                                      )}</td>
                              </tr>
                          </tfoot>
                      </table>
                      <!-- Otros detalles del pedido -->
  
                  </div>
  
                  <!-- Botón -->
                  <a href="http://localhost:5173/suministros/home" class="btn-recover" style="width: 10%;
                  align-self: center;
                  background-color:#088ec8 ;
                  border: solid 1px #cccc;
                  padding: 10px 35px 10px 35px;
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
  
              <!-- footere -->
              <div
                  style="background-color: #283765; color: #ffffff; padding: 20px 0px 0px 0px; width: 100%; text-align: center;">
                  <!-- Redes sociales -->
                  <a href="https://www.facebook.com/" class="contA" style=" margin: 0px 5px 0 5px;"><img src="cid:fb"
                          class="imag" style="  width: 20px;
                      height: 20px;
                      align-self: center;" /></a>
                  <a href="https://www.instagram.com/" class="contA" style=" margin: 0px 5px 0 5px;"><img src="cid:ig"
                          class="imag" style="  width: 20px;
                      height: 20px;
                      align-self: center;" /></a>
                  <a href="https://wa.me/573208132304" class="contA" style=" margin: 0px 5px 0 5px;"><img src="cid:wapp"
                          class="imag" style="  width: 20px;
                      height: 20px;
                      align-self: center;" /></a>
                  <a href="mailto:domiguez5493.cd@gmail.com" class="contA" style=" margin: 0px 5px 0 5px;"><img
                          src="cid:em" class="imag" style="  width: 20px;
                      height: 20px;
                      align-self: center;" /></a>
                  <!-- Redes sociales -->
  
                  <h4 style="font-weight: 500;">¡ Si tienes dudas sobre tu
                      compra !</h4>
                  <p style="font-size: 13px; padding: 0px 20px;">
                      Comunícate con nosotros por los siguientes medios:<br>
                      Correo: <a class="afooter" style=" color: white;
                      text-decoration: none;
                      font-size: 13px !important;"
                          href="mailto:dominguez5493.cd@gmail.com">soporte@suministros.com</a><br>
                      Whatsapp: <a class="afooter" style=" color: white;
                      text-decoration: none;
                      font-size: 13px !important;" href="https://wa.me/573208132304">+57 3208132304</a><br>
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
    to: usuario.email,
    subject: notificaciones[cualNotificacion].subject,
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
