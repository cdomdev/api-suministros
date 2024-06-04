import moment from "moment";

// Función para validar y formatear la fecha
const formatAndValidateDate = (date) => {
  // Verificar si la fecha está en el formato deseado (YYYY-MM-DD)
  const isValidDate = moment(date, "YYYY-MM-DD", true).isValid();

  // Si la fecha no está en el formato esperado, intenta convertirla
  if (!isValidDate) {
    const formattedDate = moment(date, ["DD-MM-YYYY", "MM-DD-YYYY"], true).format("YYYY-MM-DD");
    return formattedDate;
  }

  return date; // Devuelve la fecha original si está en el formato correcto
};

module.exports = { formatAndValidateDate };
