'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');

server.get('Start', cache.applyDefaultCache, function (req, res, next) {
    res.json({ message: 'Hello World!' });
    next();
});

module.exports = server.exports();
