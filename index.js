var path = require('path');
var fs = require('fs');

var data = fs.readFileSync(path.join(__dirname, 'data', 'data.jsonld'), 'utf8');

var jsonld = JSON.parse(data);

module.exports = jsonld;
