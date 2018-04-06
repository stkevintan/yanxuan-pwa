const sharp = require('sharp');

module.exports = (stream, options = {}) => {
    const s = sharp();
    if (options.width && options.height) {
        s.resize(1 * options.width || null, 1 * options.height || null);
    }
    if (options.quality) {
        return stream.pipe(s.webp({ quality: 1 * options.quality || null }));
    } else {
        return stream.pipe(s.webp());
    }
};
