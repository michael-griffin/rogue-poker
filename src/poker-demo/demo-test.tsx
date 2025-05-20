import { createRequire } from "module";
const require = createRequire(import.meta.url);

const readline = require('readline-sync');

// const readline = require('readline'); //OR import readline from "readline";
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

let resp = readline.question("Please enter a comma separated list of numbers:\n");
let nums = resp.split(',').map((numStr:string) => +numStr);

