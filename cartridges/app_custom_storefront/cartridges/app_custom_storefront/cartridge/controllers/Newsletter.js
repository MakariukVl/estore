'use strict';

var server = require('server');
var URLUtils = require('dw/web/URLUtils');
// Use the following for CSRF protection: add middleware in routes and hidden field on form
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');

server.get('Show', server.middleware.https, csrfProtection.generateToken, function (req, res, next) {
    var actionUrl = URLUtils.url('Newsletter-Handler');
    var newsletterForm = server.forms.getForm('newsletter');
    newsletterForm.clear();

    res.render('/newsletter/newslettersignup', {
        actionUrl: actionUrl,
        newsletterForm: newsletterForm
    });

    next();
});

server.post('Handler', server.middleware.https, csrfProtection.validateAjaxRequest, function (req, res, next) {
    var newsletterForm = server.forms.getForm('newsletter');

    // Check if email address confirmed successfully (matches)
    newsletterForm.valid =
        newsletterForm.valid &&
        newsletterForm.email.value === newsletterForm.emailconfirm.value;

    if (newsletterForm.valid) {
        try {
            var CustomObjectMgr = require('dw/object/CustomObjectMgr');
            var co = CustomObjectMgr.createCustomObject('NewsletterSubscription', newsletterForm.email.value);
            co.custom.firstName = newsletterForm.fname.value;
            co.custom.lastName = newsletterForm.lname.value;
            // Show the success page
            res.json({
                success: true,
                redirectUrl: URLUtils.url('Newsletter-Success').toString()
            });
        } catch (e) {
            var err = e;
            res.setStatusCode(500);
            res.json({
                error: true,
                redirectUrl: URLUtils.url('Error-Start').toString()
            });
        }
    } else {
        // Handle server-side validation errors here: this is just an example
        res.setStatusCode(400);
        res.json({
            error: true,
            redirectUrl: URLUtils.url('Error-Start').toString()
        });
    }

    next();
});

server.get('Success', server.middleware.https, function (req, res, next) {
    res.render('newsletter/newslettersuccess', {
        continueUrl: URLUtils.url('Newsletter-Show'),
        newsletterForm: server.forms.getForm('newsletter')
    });

    next();
});

module.exports = server.exports();
