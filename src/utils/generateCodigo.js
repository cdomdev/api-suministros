export function generarCodigoDesdeNombre(nombre) {
  if (typeof nombre !== "string") {
    throw new TypeError("El argumento debe ser una cadena de texto.");
  }
  return nombre.toLowerCase().replace(/\s+/g, "");
}
