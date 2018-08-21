const fs = require('fs');

let crearArchivo = (base) => {
    return new Promise((resolve, reject) => {

        if(!Number(base) ){
            reject('No es un número');
            return;
        }

        let data = '';

        for (let i = 1; i <= 10; i++) {
            data += (`Base: ${base} x Multiplo: ${i} = ${base * i}\n`);
        }

        fs.writeFile(`tablas/tabla-${base}`, data, (err) => {
            if (err) reject(err);
            else resolve(`tabla-${base}.txt`);
        });
    });
}

module.exports = {
    crearArchivo
}