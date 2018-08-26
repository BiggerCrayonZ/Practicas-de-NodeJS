const argv = require('yargs')
    .command('crear', 'crear un elemento por hacer', {
        descripcion: {
            demand: true,
            alias: 'd',
            desc: 'Descripción de la tarea'
        }
    })
    .command('actualizar', 'Actualizar el estado de una tarea', {
        descripcion: {
            demand: true,
            alias: 'd',
            desc: 'Descripción de la tarea'
        },
        completado: {
            default: true,
            alias: 'c',
            desc: 'Marco como completado o pendiente la tarea'
        }
    })
    .help()
    .argv;

module.exports = {
    argv
}