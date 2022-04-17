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
    var Resource = require('dw/web/Resource');
    var newsletterForm = server.forms.getForm('newsletter');

    // Check if email address confirmed successfully (matches)
    newsletterForm.valid =
        newsletterForm.valid &&
        newsletterForm.email.value === newsletterForm.emailconfirm.value;

    if (newsletterForm.valid) {
        // eslint-disable-next-line no-shadow
        this.on('route:BeforeComplete', function (req, res) {
            try {
                var Transaction = require('dw/system/Transaction');
                var CustomObjectMgr = require('dw/object/CustomObjectMgr');
                var HookMgr = require('dw/system/HookMgr');

                Transaction.wrap(function () {
                    var co = CustomObjectMgr.createCustomObject('NewsletterSubscription', newsletterForm.email.value);
                    co.custom.firstName = newsletterForm.fname.value;
                    co.custom.lastName = newsletterForm.lname.value;
                    // Use a hook to send a confirmation email
                    HookMgr.callHook('newsletter.email', 'send', newsletterForm.email.value);
                });
                // Show the success page
                res.json({
                    success: true,
                    redirectUrl: URLUtils.url('Newsletter-Success').toString()
                });
            } catch (e) {
                var err = e;
                if (err.javaName === 'MetaDataException') {
                    /* Duplicate primary key on CO: send back message to client-side, but don't log error.
                    This is possible if the user tries to subscribe with the same email multiple times */
                    res.json({
                        success: false,
                        error: [Resource.msg('error.subscriptionexists', 'newsletter', null)]
                    });
                } else {
                    /* Missing CO definition: Log error with message for site admin, set the response to error, 
                    and send error page URL to client-side */
                    var Logger = require('dw/system/Logger');
                    Logger.getLogger('newsletter_subscription')
                        .error(Resource.msg('error.customobjectmissing', 'newsletter', null));
                    // Show general error page: there is nothing else to do
                    res.setStatusCode(500);
                    res.json({
                        error: true,
                        redirectUrl: URLUtils.url('Error-Start').toString()
                    });
                }
            }
        });
    } else {
        // Handle server-side validation errors here: this is just an example
        res.json({
            success: false,
            error: [Resource.msg('error.crossfieldvalidation', 'newsletter', null)]
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
