let config = require('nconf');
let path = require('path');

config.argv()
    .env()
    .file({ file: path.join(__dirname, 'config.json') });

module.exports = config;