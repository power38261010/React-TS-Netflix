export function roundToTwoDecimals(value: any): number {
  if ( typeof value == 'number') return parseFloat(value.toFixed(2));
  else return 0;
}

export const genres = [
  "Accion", "Drama", "Belico", "Comedia", "Ciencia-Ficcion",
  "Suspenso", "Aventura", "Fantasia", "Horror", "Documental",
  "Futurista", "Retro"
];

export const roles = [
  "admin", "client"
];


export const selectStyles = {
  mb: 2,
  '& .MuiInputBase-input': { color: '#fff' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#fff' },
    '&:hover fieldset': { borderColor: '#fff' },
    '&.Mui-focused fieldset': { borderColor: '#fff' },
  },
  '& .MuiInputLabel-root': { color: '#fff' },
  '& .MuiFormHelperText-root': { color: '#fff' },
  '& .MuiSelect-icon': { color: '#fff' },
  '& .MuiPaper-root': {
    backgroundColor: '#000',
    color: '#fff',
  },
};

export const inputStyles = {
  mb: 2,
  '& .MuiInputBase-input': { color: '#fff' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#fff' },
    '&:hover fieldset': { borderColor: '#fff' },
    '&.Mui-focused fieldset': { borderColor: '#fff' },
  },
  '& .MuiInputLabel-root': { color: '#fff' },
  '& .MuiFormHelperText-root': { color: '#fff' },
  '& .MuiFormLabel-root-MuiInputLabel-root.Mui-disabled ': { color: '#fff'},
};