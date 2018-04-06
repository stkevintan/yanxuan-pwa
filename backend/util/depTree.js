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
            db.set(key, []).write();
        }

        const keyDb = db.get(key);

        if (keyDb.size().value() >= 10) {
            logger.warning('Push resource limit exceeded');
            return;
        }

        const val = keyDb.find({ filePath: item.filePath });

        if (!val.value()) {
            keyDb.push(item).write();
        } else {
            //re new relPath
            val.assign(item).write();
        }
    },
    getDep(key = this.currentKey) {
        key = this.stripDot(key);
        return db.get(key).value() || [];
    }
};
