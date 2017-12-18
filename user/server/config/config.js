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
            db: 14, //与后端共用，前端使用后8个(共16个)
            pass: ''
        },
        request_url: {
            fs_url: '10.200.110.32' // fs的outbound地址
        },
        srv: {
            enable: false,
            refresh_caches_timer: 60 * 60, // 1 hour refresh srv records cache timers
            record_expires: 24 * 60 * 60, // 24 hour srv records has expire, need refresh
            use_lock: false, // srv query record user lockfile
            try_connect_timeout: 10 * 1000 // 10 sec timeout
        },
        proxy: {
            traceSip: true,
            reWritePacket: true,
            notifyBrowserReconnect: false,
            wsServerMaxReconnection: 3,
            wsServerReconnectionTimeout: 4
        },
        fs_wss_port: 7443,
        fs_ws_port: 5066,
        fs_privateKey: path.join(__dirname, '../fakekeys/wsskey.pem'),
        fs_certificate: path.join(__dirname, '../fakekeys/wss.pem'),
        consul: {
            server_host : '10.200.110.32',
            server_port : '8500'
        },
        maxLogSize: 1024*1024*20, //Log size
        backups: 10, //Log copies
        logPath: 'meeting.log'
    },
    production: { // 线上环境配置
        isProd: true,
        root: rootPath,
        port: 83,
        maxAge: 30 * 60 * 1000,
        redis: {
            db: 14, //与后端共用，前端使用后8个(共16个)
            pass: ''
        },
        // request_url: {
        //     fs_url: '127.0.0.1' // fs的outbound地址
        // },
        srv: {
            enable: true, //开启srv服务
            refresh_caches_timer: 60 * 60, // 1 hour refresh srv records cache timers
            record_expires: 24 * 60 * 60, // 24 hour srv records has expire, need refresh
            use_lock: false, // srv query record user lockfile
            try_connect_timeout: 10 * 1000 // 10 sec timeout
        },
        proxy: {
            traceSip: true,
            reWritePacket: true,
            notifyBrowserReconnect: false,
            wsServerMaxReconnection: 3,
            wsServerReconnectionTimeout: 4
        },
        fs_wss_port: 7443,
        fs_ws_port: 5066,
        fs_privateKey: path.join(__dirname, '../fakekeys/wsskey.pem'),
        fs_certificate: path.join(__dirname, '../fakekeys/wss.pem'),
        consul: {
            server_host : '127.0.0.1',
            server_port : '8500'
        },
        maxLogSize: 1024*1024*20,
        backups: 10,
        logPath: '/var/log/yealink/web/meeting.log'
    }
}

module.exports = config[env];
