// Devuelve las iniciales de un nombre: "Marc Soler" pasa a ser "MS".
// Se usan como máximo las dos primeras palabras.
export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}
