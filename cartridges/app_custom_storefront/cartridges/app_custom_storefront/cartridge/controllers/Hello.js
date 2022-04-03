'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');

server.get(cache.applyDefaultCache);

module.exports = server.exports();
