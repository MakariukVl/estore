'use strict';

module.exports = {
    linkRemoveAllClick: function () {
        $('.remove-all').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var url = $(this).attr('href');

            if (url) {
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        if (data.success) {
                            $('.remove-all-wrapper').addClass('d-none');
                            $('.product-grid').addClass('d-none');
                            $('#maincontent').append('<h1>' + data.message + '</h1>');
                        }
                    },
                    error: function (err) {
                        if (err.responseJSON.message) {
                           console.error(err.responseJSON.message);
                        }
                    }
                });
            }
        });
    },
    productRemoveClick: function () {
        $('.product-remove').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var url = $(this).attr('href');
            var $product = $(this);
            var limit = 10;
            var i = 0;
            var pid;

            do {
                $product = $product.parent();
                pid = $product.data('pid');
            }
            while (!pid && i++ < limit);

            if (url) {
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        if (data.success) {
                            $product.parent().addClass('d-none');
                            if (data.empty) {
                                $('#maincontent').append('<h1>' + data.message + '</h1>');
                            }
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
