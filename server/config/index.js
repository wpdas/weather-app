const nconf = require('nconf');

nconf.env().file(`${__dirname}/config.json`);

module.exports = nconf;
