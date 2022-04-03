'use strict';

/**
 * @namespace Home
 */

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
// var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
// var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

server.extend(module.superModule);

server.get('Start', function (req, res, next) {
    var Site = require('dw/system/Site');
    // res.render('helloWorld', { param1: Site.current.name });
    res.json({ param1: Site.current.name });
    next();
});

server.prepend('Show', cache.applyDefaultCache, function (req, res, next) {
    var viewData = res.getViewData();
    viewData.param1 = 'This is from prepend';
    res.setViewData(viewData);
    next();
});

server.append('Show', function (req, res, next) {
    var viewData = res.getViewData();
    // declare param1 as a variable that equals 'General company details.'
    var appendParam = 'This is from append';
    var queryparam = req.querystring.param ? req.querystring.param : 'no parameter was passed';

    // Here grab whatever prepend added to viewData + the message here + the optional query string param
    res.setViewData({
        param1: viewData.param1 + ' AND ' + appendParam + ' AND querystring param = ' + queryparam
    });
    next();
});

// server.replace('Show', consentTracking.consent, cache.applyDefaultCache, function (req, res, next) {
//     var Site = require('dw/system/Site');
//     var PageMgr = require('dw/experience/PageMgr');
//     var pageMetaHelper = require('*/cartridge/scripts/helpers/pageMetaHelper');

//     var viewData = res.getViewData();
//     var replaceParam = 'This is from replace';
//     var queryparam = req.querystring.param ? req.querystring.param : 'no parameter was passed';

//     res.setViewData({
//         param1: viewData.param1 + ' AND ' + replaceParam + ' AND querystring param = ' + queryparam
//     });

//     pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);

//     var page = PageMgr.getPage('homepage');

//     if (page && page.isVisible()) {
//         res.page('homepage');
//     } else {
//         res.render('home/homePage');
//     }
//     next();
// }, pageMetaData.computedPageMetaData);

module.exports = server.exports();
