const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./dep.json');
const logger = require('./logger');
const db = low(adapter);

let currentKey = '/';

module.exports = {
    get currentKey() {
        return currentKey;
    },
    set currentKey(key = '') {
        currentKey = this.stripDot(key);
    },
    stripDot(str) {
        if (!str) return '';
        return str.replace(/index\.html$/, '').replace(/\./g, '-');
    },
    addDep(item, key = this.currentKey) {
        if (!key) return;
        key = this.stripDot(key);
        item = { relPath: item.relPath, filePath: item.filePath };
        if (!db.has(key).value()) {
            db
                .set(key, [])
                .get(key)
                .push(item)
                .write();
            return true;
        }
        const keyDb = db.get(key);
        const isInArr = keyDb.find({ relPath: item.relPath }).value();

        if (!isInArr) {
            keyDb.push(item).write();
            return true;
        }
        return false;
    },
    getDep(key = this.currentKey) {
        key = this.stripDot(key);
        return db.get(key).value() || [];
    }
};
