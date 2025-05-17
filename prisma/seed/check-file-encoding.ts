// @ts-nocheck

// If there are characters like â€™ in the output, the files are reading as utf8
// but the original file was exported with 'smart' characters with something
// like Windows-1252 

const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../../lexicon.csv");

const content = fs.readFileSync(filePath, { encoding: "utf8" });

console.log(content.slice(0, 1000)); // show first 1000 chars
