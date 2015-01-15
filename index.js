var fs = require('fs'),
    path = require('path');

module.exports = JSON.parse(fs.readFileSync(path.join('data', 'data.jsonld'),'utf8'));
