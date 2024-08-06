export function generarCodigoDesdeNombre(nombre) {
  return nombre.toLowerCase().replace(/\s+/g, "");
}
