const url = require('url');
const http = require('http');
const config = require('../config/config')
const Consul = require('../lib/consul')

//---------
const PING_INTERVAL = 15000;
const PING_TIMEOUT = 5000;
//---------

let serverStats = {};
startDate = Date.now();
let backendServer = 'http://' + Object.keys(serverStats)[0];


function getKey(server) {
    let key = server.hostname + ":" + server.port;
    return key;
}

function getServerFromKey(key) {
    let server = {};
    let keyComponents = key.split(":");
    server['hostname'] = keyComponents[0];
    server['port'] = keyComponents[1];
    server['path'] = '/health';
    return server;
}

function ping(server) {
    let key = getKey(server);
    let start = Date.now();
    http.get(server, function (res) {
        let date = Date.now();
        serverStats[key].lastContact = date;
        serverStats[key].ping = date - start;

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                if( parsedData.status != 'UP' ) {
                    serverStats[key].ping = 10000000;
                    console.error("server:" + key + " status is 'DOWN'");
                }
              } catch (e) {
                console.error(e.message);
              }
        });
    }).on('error', function (e) {
        serverStats[key].ping = 10000000;
        console.error('server:' + key + " is down");
    }).setTimeout(PING_TIMEOUT, function () {
        serverStats[key].ping = 10000000;
        console.error('server:' + key + " connect timeout");
    });
}

function retLowestPing() {
    let lowestPing = Number.MAX_VALUE;
    let lowestServer = null;
    let serverStatsKeys = Object.keys(serverStats);
    for (let i = 0; i < serverStatsKeys.length; i++) {
        let key = serverStatsKeys[i];
        let serverStat = serverStats[key];
        if (serverStat.ping < lowestPing) {
            lowestPing = serverStat.ping;
            lowestServer = key;
        }
    }
    return lowestServer;
}

function server() {
    let serverStatsKeys = Object.keys(serverStats);
    for (let i = 0; i < serverStatsKeys.length; i++) {
        let key = serverStatsKeys[i];
        ping(getServerFromKey(key));
    }
    backendServer = 'http://' + retLowestPing()
    return backendServer;
}

function getServer(app) {
    return new Promise(function (resolve, reject) {
        let request_url;
        Consul.getGateway()
            .then((res) => {
                request_url = res;
                if (request_url && request_url.length > 0) {
                    request_url.forEach(function (val) {
                        serverStats[val] = {
                            ping: 0,
                            lastContact: startDate,
                            health: 100
                        }
                    }, this);
                }
                app.set('SER', server())
                resolve(backendServer)
            })
            .catch((err) => {
                console.error(err)
                reject(err)
            });
        })
}

function timer(app) {
    setInterval(function () {
        let serverStatsKeys = Object.keys(serverStats);
        for (let i = 0; i < serverStatsKeys.length; i++) {
            let key = serverStatsKeys[i];
            ping(getServerFromKey(key));
        }
        backendServer = 'http://' + retLowestPing()
        app.set('SER', backendServer)
    }, PING_INTERVAL);
}

module.exports = {
    getServer: getServer,
    timer: timer
};