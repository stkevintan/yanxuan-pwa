const http2 = require('http2');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const zlib = require('zlib');
const {encodingMethods, compressOptions} = require('./compressConf');
const logger = require('./logger');
const {HTTP2_HEADER_PATH} = http2.constants;
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
  if (fs.existsSync(baseDir)) {
    fs.readdirSync(baseDir).forEach(fileName => {
      const filePath = path.join(baseDir, fileName);
      const fd = fs.openSync(filePath, 'r');
      fileMap.set(filePath, {fd, headers: getFileHeaders(filePath, fd)});
    });
  }
}

getFiles(baseDir);

exports.push = function(stream, file, encoding) {
  if (!file || !file.filePath || !file.url) return;
  if (!file.fd || !file.headers) {
    const queryRet = fileMap.get(file.filePath) || {};
    file.fd = file.fd || queryRet.fd || fs.openSync(file.filePath, 'r');
    file.headers = file.headers || queryRet.headers ||
        getFileHeaders(file.filePath, file.fd);
  }

  const pushHeaders = {[HTTP2_HEADER_PATH]: file.url};
  const { filter, threshold } = compressOptions;

  const shouldCompress = encoding !== 'identity' && encoding != null &&
      filter(file.headers['content-type']) &&
      file.headers['content-length'] >= threshold;

  stream.pushStream(pushHeaders, (err, pushStream) => {
    if (err) {
      logger.error('server push error');
      throw err;
    }
    logger.ok('Server Push Resource:', file.filePath);
    if (shouldCompress) {
      logger.ok(encoding, 'compress resource!');
      const header = Object.assign({}, file.headers);
      header['content-encoding'] = encoding;
      delete header['content-length'];
      pushStream.respond(header);
      // the first parameters of createReadStream can be just null, because fd
      // is provided.
      const fileStream = fs.createReadStream(null, {fd: file.fd});
      const compressTransformer = encodingMethods[encoding](compressOptions);
      fileStream.pipe(compressTransformer).pipe(pushStream);
      pushStream.on('close', e => {
        fileStream.destroy();
      })
    } else {
      pushStream.respondWithFD(file.fd, file.headers);
    }
  });
};

exports.acceptsHtml = (header, options = {}) => {
  if (!header || typeof header !== 'string') return false;
  options.htmlAcceptHeaders = options.htmlAcceptHeaders || ['text/html', '*/*'];

  for (let i = 0; i < options.htmlAcceptHeaders.length; i++) {
    if (header.indexOf(options.htmlAcceptHeaders[i]) !== -1) {
      return true;
    }
  }

  return false;
};
