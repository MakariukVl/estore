'use strict';

var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');

/**
 * @function deleteCOs
 * @description Function that deletes all custom object for a CO type passed as a parameter.
 *
 * @param {Object} parameters Represents the parameters defined in the steptypes.json file
 */
module.exports = {
    deleteCOs: function deleteCOs(parameters) {
        var iterator;
        var result = false;

        try {
            // Search COs by type only, no query string, no sorting
            iterator = CustomObjectMgr.queryCustomObjects(parameters.CustomObjectType, '', null);
            result = true;
        } catch (error) {
            var Logger = require('dw/system/Logger');
            Logger.error('Delete Custom Object Fail: ' + error.toString());
        }

        if (!result) {
            return;
        }

        while (iterator.hasNext()) {
            var customObject = iterator.next();
            // eslint-disable-next-line no-loop-func
            Transaction.wrap(function () {
                CustomObjectMgr.remove(customObject);
            });
        }

        iterator.close();
    }
};
