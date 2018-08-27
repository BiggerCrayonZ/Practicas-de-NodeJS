//const argv = require('yargs').argv;

const argv = require('./config/yargs.js').argv;

console.log(argv);

let comando = argv._[0];

switch (comando) {
    case 'crear':
        console.log('Crear por hacer');
        break;
    case 'listar':
        console.log('Mostrar todas las tareas');
        break;
    case 'actualizar':
        console.log('Actualiza una tarea');
        break;
    default:
        console.log('Comando no reconocido');
}