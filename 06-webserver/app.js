const http = require('http');
const port = 8080;

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    let sal = {
        nombre: "Rulas",
        url: req.url
    }
    res.write(JSON.stringify(sal));
    res.end();
}).listen(port);

console.log('Listen a port: ', port);
