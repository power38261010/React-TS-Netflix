export function roundToTwoDecimals(value: any): number {
  if ( typeof value == 'number') return parseFloat(value.toFixed(2));
  else return 0;
}

export const genres = [
  "Accion", "Drama", "Belico", "Comedia", "Ciencia-Ficcion",
  "Suspenso", "Aventura", "Fantasia", "Horror", "Documental",
  "Futurista", "Retro"
];