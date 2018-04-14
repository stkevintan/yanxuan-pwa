const sharp = require('sharp');

function parse(x) {
  return x * 1 || null;
}
module.exports = (
  options = { width: 0, height: 0, quality: 0, fomart: 'png' }
) => {
  const s = sharp();
  if (options.width || options.height) {
    s.resize(parse(options.width), parse(options.height));
  }
  if (options.fomart === 'webp') {
    return s.webp({ quality: parse(options.quality) });
  }
  return s.png({ quality: parse(options.quality) });
};
