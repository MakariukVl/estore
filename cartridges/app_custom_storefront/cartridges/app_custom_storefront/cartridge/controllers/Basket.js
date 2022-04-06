'use strict';

var server = require('server');

/**
 * Basket-Show: this endpoint shows what basket contains
 */
server.get('Show', function (req, res, next) {
    // var basketMgr = require('dw/order/BasketMgr');
    // var currentBasket = basketMgr.getCurrentBasket();
    // // var lineItems = currentBasket ? currentBasket.allProductLineItems.toArray() : [];
    // var lineItems = currentBasket ? currentBasket.getProductLineItems().toArray() : [];
    // var items = lineItems.map(function (i) {
    //     return {
    //         text: i.lineItemText,
    //         price: i.grossPrice.value
    //     };
    // });

    var BasketMgr = require('dw/order/BasketMgr');
    var CartModel = require('*/cartridge/models/cart');
    var basketModel = new CartModel(BasketMgr.currentBasket);
    res.render('basket', basketModel);
    next();
});

module.exports = server.exports();
