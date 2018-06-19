let empleados = [{
    id: 1,
    nombre: "Raúl"
}, {
    id: 2,
    nombre: "Alex"
}, {
    id: 3,
    nombre: "Juan"
}, {
    id: 4,
    nombre: "Paco"
}, {
    id: 5,
    nombre: "Lola"
}];

let salarios = [{
    id: 1,
    salario: 1000
}, {
    id: 2,
    salario: 2000
}, {
    id: 3,
    salario: 3000
}, {
    id: 4,
    salario: 4000
}, {
    id: 5,
    salario: 1500
}];

let getEmpleado = (id) => {
    return new Promise((resolve, reject) => {
        let empleadoDB = empleados.find(empleado => empleado.id === id)

        if (!empleadoDB) {
            reject(`No existe el empleado con el ID: ${id}`);
        } else {
            resolve(empleadoDB);
        }
    });
}

let getSalario = (id) => {
    return new Promise((resolve, reject) => {
        let salarioDB = salarios.find(salario => salario.id === id)

        if (!salarioDB){
            reject(`No existe salario alguno con el ID: ${ id }`);
        } else {
            resolve(salarioDB);
        }
    });
}

// getEmpleado(10).then(empleado => {
//     console.log("Empleado de DB: ", empleado);
// }, (err) => {
//     console.log(err);
// })

getSalario(5).then(salario => {
    console.log("Salario de DB: ", salario);
}, (err) => {
    console.log(err);
});