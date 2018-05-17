"use strict";

const url = require("url");
const logger = require('../util/logger');
const { acceptsHtml } = require('../util/helper');
module.exports = options => {
    options = options || {};
    return async (ctx, next) => {
        if (ctx.method !== "GET") {
            logger.info(
                "Not rewriting",
                ctx.method,
                ctx.url,
                "because the method is not GET."
            );
            return next();
        } else if (!ctx.header || typeof ctx.header.accept !== "string") {
            logger.info(
                "Not rewriting",
                ctx.method,
                ctx.url,
                "because the client did not send an HTTP accept header."
            );
            return next();
        } else if (ctx.header.accept.indexOf("application/json") === 0) {
            logger.info(
                "Not rewriting",
                ctx.method,
                ctx.url,
                "because the client prefers JSON."
            );
            return next();
        } else if (!acceptsHtml(ctx.header.accept, options)) {
            logger.info(
                "Not rewriting",
                ctx.method,
                ctx.url,
                "because the client does not accept HTML."
            );
            return next();
        }

        // white list check
        if (options.whiteList) {
            const inWhiteList = options.whiteList.some(item =>
                new RegExp(item).test(ctx.url)
            );
            if (inWhiteList) {
                return next();
            }
        }

        const parsedUrl = url.parse(ctx.url);
        let rewriteTarget;
        options.rewrites = options.rewrites || [];

        for (const rewrite of options.rewrites) {
            const match = parsedUrl.pathname.match(rewrite.from);
            if (match !== null) {
                rewriteTarget = evaluateRewriteRule(
                    parsedUrl,
                    match,
                    rewrite.to
                );
                logger.ok("Rewriting", ctx.method, ctx.url, "to", rewriteTarget);
                ctx.url = rewriteTarget;
                return next();
            }
        }

        if (
            parsedUrl.pathname.indexOf(".") !== -1 &&
            options.disableDotRule !== true
        ) {
            logger.info(
                "Not rewriting",
                ctx.method,
                ctx.url,
                "because the path includes a dot (.) character."
            );
            return next();
        }

        rewriteTarget = options.index || "/index.html";
        logger.ok("Rewriting", ctx.method, ctx.url, "to", rewriteTarget);
        ctx.url = rewriteTarget;

        return next();
    };
};

function evaluateRewriteRule(parsedUrl, match, rule) {
    if (typeof rule === "string") {
        return rule;
    } else if (typeof rule !== "function") {
        throw new Error("Rewrite rule can only be of type string of function.");
    }

    return rule({
        parsedUrl: parsedUrl,
        match: match
    });
}

