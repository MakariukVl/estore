'use strict';

/**
 * @namespace Wishlist
 */

var server = require('server');
var productListHelper = require('*/cartridge/scripts/productList/productListHelpers');
var Resource = require('dw/web/Resource');
// var ProductListMgr = require('dw/customer/ProductListMgr');
// var ProductMgr = require('dw/catalog/ProductMgr');
var TYPE_WISH_LIST = 10;

server.get('Show', function (req, res, next) {
    var collections = require('*/cartridge/scripts/util/collections');
    var ProductListItemModel = require('*/cartridge/models/productListItem');

    // eslint-disable-next-line no-undef
    var customerWishList = productListHelper.getCurrentOrNewList(customer, {
        type: TYPE_WISH_LIST
    });

    var apiProductItems = customerWishList.getProductItems();

    var productItems = collections.map(apiProductItems, function (apiProductItem) {
        return new ProductListItemModel(apiProductItem).productListItem;
    });

    res.render('wishlist', {
        productItems: productItems
    });

    next();
});

server.post('AddProduct', function (req, res, next) {
    // The req parameter has a property called form. In this use case
    // the form could have the following:
    // ! pid - the Product ID
    var message;
    var statusCode = 200;
    var success;
    var pid = req.form.pid;

    var config = {
        type: TYPE_WISH_LIST,
        qty: 1,
        req: req
    };

    // eslint-disable-next-line no-undef
    var customerWishList = productListHelper.getCurrentOrNewList(customer, {
        type: TYPE_WISH_LIST
    });

    if (pid) {
        message = productListHelper.itemExists(customerWishList, pid, config) ?
            Resource.msg('wishlist.add.exist', 'wishlist', null) :
            Resource.msg('wishlist.add.error', 'wishlist', null);
        success = productListHelper.addItem(customerWishList, pid, config);
        statusCode = success ? 200 : 500;
    } else {
        message = Resource.msg('wishlist.pid.body.missed', 'wishlist', null);
        statusCode = 400;
    }

    if (success) {
        res.json({
            success: true,
            message: Resource.msg('wishlist.add.success', 'wishlist', null)
        });
    } else {
        res.setStatusCode(statusCode);
        res.json({
            error: message || Resource.msg('wishlist.add.fail', 'wishlist', null)
        });
    }

    next();
});

server.get('RemoveProduct', function (req, res, next) {
    // The req parameter has a property called querystring. In this use case
    // the querystring could have the following:
    // ! pid - the Product ID
    var pid = req.querystring.pid;

    if (pid) {
        // eslint-disable-next-line no-undef
        var wishlist = productListHelper.removeItem(customer, pid, {
            req: req,
            type: TYPE_WISH_LIST
        });

        var listIsEmpty = wishlist.prodList.items.empty;

        var message = listIsEmpty ?
            Resource.msg('wishlist.remove.empty', 'wishlist', null) :
            Resource.msg('wishlist.remove.success', 'wishlist', null);

        res.json({
            success: true,
            empty: listIsEmpty,
            message: message
        });
    } else {
        res.setStatusCode(400);
        res.json({
            error: Resource.msg('wishlist.pid.query.missed', 'wishlist', null)
        });
    }

    next();
});

server.get('Icon', function (req, res, next) {
    // The req parameter has a property called querystring. In this use case
    // the querystring could have the following:
    // ! pid - the Product ID
    var pid = req.querystring.pid;
    var isInListObj;
    var isInList = false;

    // eslint-disable-next-line no-undef
    var customerWishList = productListHelper.getCurrentOrNewList(customer, {
        type: TYPE_WISH_LIST
    });

    isInListObj = productListHelper.itemExists(customerWishList, pid, {});
    isInList = !!isInListObj;

    if (!pid) {
        res.setStatusCode(400);
    }

    res.render('product/components/wishlistHeart', {
        wishlist: {
            isInWishlist: isInList
        }
    });

    next();
});

module.exports = server.exports();
