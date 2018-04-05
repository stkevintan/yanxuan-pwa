const { format } = require('util');
const chalk = require('chalk');

const TAG = '[yanxuan %s]';
class Logger {
    constructor(logger = console.log.bind(console)) {
        this.logger = logger;
    }
    log(type, color, ...args) {
        const prefix = format(TAG, type);
        this.logger(chalk.bold[color](prefix), ...args);
    }
    info(...args) {
        this.log('info', 'white', ...args);
    }
    ok(...args) {
        this.log('ok', 'green', ...args.map(arg => chalk.bold(arg)));
    }
    warning(...args) {
        this.log('warning', 'yellow', ...args);
    }
    error(...args) {
        this.log('error', 'red', ...args);
    }
}

module.exports = new Logger();
