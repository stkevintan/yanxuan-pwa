const zlib = require('zlib');
const compressible = require('compressible');
/**
 * Encoding methods supported.
 */
exports.encodingMethods = {
  gzip: zlib.createGzip,
  deflate: zlib.createDeflate
};

exports.compressOptions = {
  // filter: (content_type) => /text|javascript|json/i.test(content_type),
  filter: compressible,
  threshold: 1024,
  flush: zlib.Z_SYNC_FLUSH
};
