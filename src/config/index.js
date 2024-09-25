import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

var normalizedPath = __dirname;
var data = {}

fs.readdirSync(normalizedPath).forEach(function(file) {
    if(file != 'index.js'){
        data[file.split('.')[0]] = import(path.join(__dirname, file))['default'];
    }
});

export default data;
