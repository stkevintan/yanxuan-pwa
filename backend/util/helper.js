const http2 = require('http2');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

const logger = require('./logger');
const { HTTP2_HEADER_PATH } = http2.constants;
const baseDir = './mimg';
const fileMap = new Map();

function getFileHeaders(path, fd) {
    const stat = fs.fstatSync(fd);
    const contentType = mime.getType(path);
    return {
        'content-length': stat.size,
        'last-modified': stat.mtime.toUTCString(),
        'content-type': contentType
    };
}

function getFiles(baseDir) {
    fs.readdirSync(baseDir).forEach(fileName => {
        const filePath = path.join(baseDir, fileName);
        const fd = fs.openSync(filePath, 'r');
        fileMap.set(filePath, {
            fd,
            headers: getFileHeaders(filePath, fd)
        });
    });

    return fileMap;
}

getFiles(baseDir);

exports.fileMap = fileMap;

exports.push = function(stream, file) {
    if (!file || !file.filePath || !file.relPath) return;
    if (!file.fd || !file.headers) {
        const queryRet = fileMap.get(file.filePath) || {};
        file.fd = file.fd || queryRet.fd || fs.openSync(file.filePath, 'r');
        file.headers =
            file.headers ||
            queryRet.headers ||
            getFileHeaders(file.filePath, file.fd);
    }
    // process.nextTick(() => {
    const pushHeaders = { [HTTP2_HEADER_PATH]: file.relPath };
    stream.pushStream(pushHeaders, (err, pushStream) => {
        if (err) {
            logger.error('server push error');
            throw err;
        }
        logger.ok('Server Push Resource:', file.filePath);
        pushStream.respondWithFD(file.fd, file.headers);
    });
    // });
};

exports.acceptsHtml = (header, options = {}) => {
    options.htmlAcceptHeaders = options.htmlAcceptHeaders || [
        'text/html',
        '*/*'
    ];

    for (let i = 0; i < options.htmlAcceptHeaders.length; i++) {
        if (header.indexOf(options.htmlAcceptHeaders[i]) !== -1) {
            return true;
        }
    }

    return false;
};
