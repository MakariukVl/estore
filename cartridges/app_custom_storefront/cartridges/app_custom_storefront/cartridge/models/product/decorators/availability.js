'use strict';

var Resource = require('dw/web/Resource');

var base = module.superModule;

/**
 * Gets items in stock left messages from resources
 * @param {Object} availabilityModel javascript model in stock available items
 * @returns {Object} items in stock
 */
function getAtsMessage(availabilityModel) {
    var ATS = {};
    ATS.messages = [];
    var inventoryRecord = availabilityModel.inventoryRecord;

    if (inventoryRecord) {
        ATS.messages.push(
            Resource.msgf(
                'label.quantity.in.stock',
                'common',
                null,
                inventoryRecord.ATS.value
            )
        );
    }

    return ATS;
}

module.exports = function (object, quantity, minOrderQuantity, availabilityModel) {
    base.call(this, object, quantity, minOrderQuantity, availabilityModel);

    Object.defineProperty(object, 'ats', {
        enumerable: true,
        writable: true,
        value: getAtsMessage(availabilityModel)
    });
};
