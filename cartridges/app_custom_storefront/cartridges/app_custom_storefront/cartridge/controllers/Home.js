'use strict';

/**
 * @namespace Home
 */

var server = require('server');
server.extend(module.superModule);

server.get('Start', function (req, res, next) {
    var Site = require('dw/system/Site');
    // res.render('helloWorld', { param1: Site.current.name });
    res.json({ param1: Site.current.name });
    next();
});

module.exports = server.exports();
