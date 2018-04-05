const fs = require("fs");
const path = require("path");
const glob = require("glob");
const axios = require("axios");
const entries = [
    "components/**/*.vue",
    "pages/**/*.vue",
    "backend/util/data.json"
];

entries.forEach(pos => {
    glob(pos, (err, files) => {
        if (err) throw err;
        files.map(file => handleFile(file));
    });
});

const pattern = /http:\/\/yanxuan\.nosdn\.127\.net\/[\w-./]*/gm;
function handleFile(filePath) {
    // console.log(path.basename(filePath));
    const content = fs.readFileSync(filePath, { encoding: "utf8" });
    const newContent = content.replace(pattern, url => {
        const basename = path.basename(url);
        const savePath = path.join(`./backend/mimg/`, basename);
        console.log("downloading,", url);
        axios({
            method: "GET",
            url,
            responseType: "stream"
        }).then(res => {
            res.data.pipe(fs.createWriteStream(savePath));
        });
        return `https://gbzhu.cn/mimg/${basename}`;
    });
    fs.writeFileSync(filePath, newContent);
}
