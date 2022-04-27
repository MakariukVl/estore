'use strict';

var base = require('base/product/base');

module.exports = {
    setHeartInitialState: function () {
        $(document).ready(function () {
            $('body').on('wishlist:toggle', function () {
                $('.wishlist-heart').each(function () {
                    $(this).toggleClass('d-none');
                });
            });
        });
    },

    toggleHearts: function () {
        $('.wishlist-heart').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var dataActionUrl = $(this).data('action-url');
            var dataActionType = $(this).data('action-type');

            var form = {
                pid: base.getPidValue($('body'))
            };

            if (dataActionUrl) {
                // request action url
                $.ajax({
                    url: dataActionUrl,
                    type: dataActionType,
                    dataType: 'json',
                    data: form,
                    success: function (data) {
                        if (data.success) {
                            $('body').trigger('wishlist:toggle');
                        }
                    },
                    error: function (err) {
                        if (err.responseJSON.error) {
                           console.error(err.responseJSON.error);
                        }
                    }
                });
            }
        });
    }
};
