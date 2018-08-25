'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function (inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function () {
    inputString = inputString.split('\n');
    main();
});

function readLine() {
    return inputString[currentLine++];
}

// Complete the compareTriplets function below.
function compareTriplets(a, b) {
    console.log("A: ", a);
    console.log("B: ", b);
    let resultA = 0, resultB = 0;


    if (a[0] > b[0]) resultA++; else resultB++;
    if (a[1] > b[1]) resultA++; else resultB++;
    if (a[2] > b[2]) resultA++; else resultB++;

    console.log("resA: ", resultA);
    console.log("resB: ", resultB);
    return [resultA, resultB];
}

function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const a = readLine().replace(/\s+$/g, '').split(' ').map(aTemp => parseInt(aTemp, 10));

    const b = readLine().replace(/\s+$/g, '').split(' ').map(bTemp => parseInt(bTemp, 10));

    const result = compareTriplets(a, b);
    console.log("Res: ", result);
    ws.write(result.join(' ') + '\n');

    ws.end();
}