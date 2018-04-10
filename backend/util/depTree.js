const logger = require('./logger');

const db = new Map();
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
    addDep(filePath, url, key = this.currentKey) {
        if (!key) return;
        key = this.stripDot(key);
        if(!db.has(key)){
            db.set(key,new Map());
        }
        const keyDb = db.get(key);

        if (keyDb.size >= 10) {
            logger.warning('Push resource limit exceeded');
            return;
        }
        keyDb.set(filePath, url);
    },
    getDep(key = this.currentKey) {
        key = this.stripDot(key);
        const keyDb = db.get(key);
        if(keyDb == undefined) return [];
        const ret = [];
        for(const [filePath,url] of keyDb.entries()){
            ret.push({filePath,url});
        }
        return ret;
    }
};
