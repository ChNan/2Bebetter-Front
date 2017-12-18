const log4js = require('log4js');
const config = require('../config/config')

let logConfig = {
    appenders: {
        console: {
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: "[%d{ISO8601_WITH_TZ_OFFSET}]-[%c]-[%p] : %m"
            }
        }
    },
    categories: {
        default: {
            appenders: ['console'],
            level: 'info'
        }
    },
}

if (config.isProd) {
    logConfig.appenders.cheese = {
        type: 'file',
        filename: config.logPath,
        layout: {
            type: 'pattern',
            pattern: "[%d{ISO8601_WITH_TZ_OFFSET}]-[%c]-[%p] : %m"
        },
        maxLogSize: config.maxLogSize,
        backups: config.backups
    }
    logConfig.categories.default.appenders.push('cheese')
}

log4js.configure(logConfig);
let logger = log4js.getLogger('meeting');

exports.logger = function (name, level) {
    return logger;
};

exports.use = function (app, level) {
    app.use(log4js.connectLogger(logger, {
        level: 'info'
    }));
    console.log = logger.info.bind(logger)
    console.info = logger.info.bind(logger)
    console.warn = logger.warn.bind(logger)
    console.error = logger.error.bind(logger)
}
