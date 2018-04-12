var url = require('url');

/**
 * Force SSL.
 *
 * @param {Integer} port
 * @param {String} hostname
 * @param {Boolean} temporary
 * @return {Function}
 * @api public
 */

module.exports = function forceSSL(port, hostname, temporary) {
    return async function forceSSL(ctx, next) {
        if (ctx.secure) {
            return await next();
        }
        var httpsPort = port || 443;
        var urlObject = url.parse('http://' + ctx.request.header.host);
        var httpsHost = hostname || urlObject.hostname;
        if (!temporary) {
            ctx.response.status = 301;
        }
        ctx.response.redirect('https://' + httpsHost + ':' + httpsPort + ctx.request.url);
    };
};
