const path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'production';

var config = {
    development: {
        isProd: false,
        root: rootPath,
        port: 3000,
        maxAge: 30 * 60 * 1000,
        redis: {
            db: 13, //与后端共用，前端使用后8个(共16个)
            pass: ''
        },
        consul: {
            server_host: '10.200.110.31',
            server_port: '8500'
        },
        maxLogSize: 1024*1024*20, //Log size
        backups: 10, //Log copies
        logPath: 'admin.log'
    },
    production: {
        isProd: true,
        root: rootPath,
        port: 82,
        maxAge: 30 * 60 * 1000,
        redis: {
            db: 13, //与后端共用，前端使用后8个(共16个)
            pass: ''
        },
        consul: {
            server_host: '127.0.0.1',
            server_port: '8500'
        },
        maxLogSize: 1024*1024*20, //Log size
        backups: 10, //Log copies
        logPath: '/var/log/yealink/web/admin.log'
    }
}

module.exports = config[env];
