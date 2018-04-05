const data = require("./data");
const fs = require("fs");

let id = 0;
for (const m of data.home.manufacturer) {
    m.mId += `_${id++}`;
}
id = 0;
for (const m of data.home.newItems) {
    m.pId += `_${id++}`;
}

id = 0;
for (const m of data.home.hotItems) {
    m.pId += `_${id++}`;
}

id = 0;
for (const m of data.home.categoryCommodity) {
    m.categoryId += `_${id++}`;
}

id = 0;
for (const m of data.home.categoryCommodity) {
    for (n of m.commodities) {
        n.pId += `_${id++}`;
    }
}

id = 0;
for (const m of data.manufacturers) {
    m.mId += `_${id++}`;
}

id = 0;
for (const m of data.itemRecommend.commodities) {
    m.pId += `_${id++}`;
}

id = 0;
for (const m of data.allNewItem.commodities) {
    m.pId += `_${id++}`;
}

id = 0;
for (const m of data.topicDetail.commodities) {
    m.pId += `_${id++}`;
}

id = 0;
for (const m of data.section["1000001"]) {
    m.subCategoryId += `_${id++}`;
}

id = 0;
for (const m of data.section["1000002"]) {
    m.subCategoryId += `_${id++}`;
}

id = 0;
for (const m of data.section["1000003"]) {
    m.subCategoryId += `_${id++}`;
}

id = 0;
for (const m of data.section["1000004"]) {
    m.subCategoryId += `_${id++}`;
}

id = 0;
for (const m of data.categoryCommodity.commodities) {
    m.pId += `_${id++}`;
}

id = 0;
for (const m of data.pinCommodity) {
    m.pinId += `_${id++}`;
}

fs.writeFileSync("db.json", JSON.stringify(data), {
    encoding: "utf8"
});
