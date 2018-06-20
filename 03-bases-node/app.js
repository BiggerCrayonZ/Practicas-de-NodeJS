
const { crearArchivo } = require('./multiplicar/multiplicar')

let base = 4;



console.log(multiplicar);
crearArchivo(base)
    .then(archivo => console.log(`Archivo Creado con base: ${archivo}`));