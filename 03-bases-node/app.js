
const { crearArchivo } = require('./multiplicar/multiplicar')

let base = 'ABC';

crearArchivo(base)
    .then(archivo => console.log(`Archivo Creado con base: ${archivo}`))
    .catch(e => console.log(e));