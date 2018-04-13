const sharp = require('sharp');

function parse(x) {
  return x * 1 || null;
}
module.exports = (
  enableWebp,
  options = { width: 0, height: 0, quality: 0 }
) => {
  const s = sharp();
  if (options.width || options.height) {
    s.resize(parse(options.width), parse(options.height));
  }

  return enableWebp
    ? s.webp({
        quality: parse(options.quality)
      })
    : s.png({ quality: parse(options.quality) });
};
