const config = require('../config/config')
const request = require('request')
const async = require('async')
const consul = require('consul')({
    host: config.consul.server_host,
    port: config.consul.server_port,
    secure: false,
    promisify: false
});

function register() {
    if (config.isProd) {
        setTimeout(() => {
            register()
        }, 3 * 60 * 1000)
        let wanurl = 'http://wanip.yealink.com/ip.jsp';
        let lanurl = 'http://lanip.yealink.com/ip.jsp';
        let headers = {
            'Content-Type': 'application/json'
        };

        async.parallel({
            getLanIP: function getLanIP(cb) {
                request.get({
                    url: lanurl,
                    headers: headers,
                    timeout: 3000
                }, (err, response, body) => {
                    if (err) {
                        return cb(null, '127.0.0.1');
                    } else {
                        try {
                            return cb(null, JSON.parse(body).ip);
                        } catch (e) {
                            console.error(e);
                            return cb(null, null);
                        }
                    }
                });
            },
            getWanIP: function getWanIP(cb) {
                request.get({
                    url: wanurl,
                    headers: headers,
                    timeout: 3000
                }, (err, response, body) => {
                    if (err) {
                        return cb(err);
                    } else {
                        try {
                            return cb(null, JSON.parse(body).ip);
                        } catch (e) {
                            console.error(e);
                            return cb(null, null);
                        }
                    }
                });
            }
        }, function (err, results) {
            if (err) {
                console.error(err);
            } else {
                let lanIP = results.getLanIP;
                let wanIP = results.getWanIP;
                if (lanIP && wanIP) {
                    consul.agent.service.register({
                        "Name": "business-web-enterprise",
                        "ID": "business-web-enterprise-" + wanIP,
                        "Tags": [
                            "version=1.1.14",
                            "environment=production",
                            `wan-service=${wanIP}`,
                            `lan-service=${lanIP}`
                        ],
                        "Address": lanIP,
                        "Port": config.port,
                        "EnableTagOverride": false,
                        "Check": {
                            "DeregisterCriticalServiceAfter": "10m",
                            "tls_skip_verify": true,
                            "HTTP": `http://${wanIP}:${config.port}`,
                            "Interval": "30s"
                        }
                    }, function (err) {
                        if (err) {
                            console.error(err);
                        };
                    });
                }
            }
        });
    }
}

function getGateway() {
    return new Promise(function (resolve, reject) {
        let arr = [];
        let datacenter = null;
        let area = null;
        consul.catalog.service.nodes('business-ws-gateway', function (err, res) {
            if (err) {
                reject(err)
            } else {
                if (res && res.length > 0) {
                    res.forEach(function (val) {
                        let isLan = false;
                        val.ServiceTags.forEach((v) => {
                            if (v.indexOf('lan-service') != -1) {
                                isLan = true;
                                arr.push(`${v.split('=')[1]}:${val.ServicePort}`)
                            }
                        })
                        if (!isLan) {
                            arr.push(`${val.ServiceAddress}:${val.ServicePort}`)
                        }
                    }, this);
                    area = res[0].Datacenter
                }
                consul.catalog.datacenters(function (err, result) {
                    if (err) {
                        reject(err)
                    } else {
                        datacenter = result.filter((val) => {
                            return val != area;
                        });
                        if (datacenter.length > 0) {
                            for (let i = 0; i < datacenter.length; i++) {
                                (function (i) {
                                    consul.catalog.service.nodes({
                                        service: 'business-ws-gateway',
                                        dc: datacenter[i]
                                    }, function (err, result) {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            if (result && result.length > 0) {
                                                result.forEach(function (val) {
                                                    let isLan = false;
                                                    val.ServiceTags.forEach((v) => {
                                                        if (v.indexOf('wan-service') != -1) {
                                                            isLan = true;
                                                            arr.push(`${v.split('=')[1]}:${val.ServicePort}`)
                                                        }
                                                    })
                                                    if (!isLan) {
                                                        arr.push(`${val.ServiceAddress}:${val.ServicePort}`)
                                                    }
                                                }, this);
                                                if (i == datacenter.length - 1) {
                                                    console.log("Back-end service " + arr)
                                                    resolve(arr)
                                                }
                                            } else {
                                                console.log("Back-end service " + arr)
                                                resolve(arr)
                                            }
                                        }
                                    });
                                })(i)
                            }
                        } else {
                            console.log("Back-end service " + arr)
                            resolve(arr)
                        }
                    }
                });
            }

        })

    })
}

function getRedisHost() {
    return new Promise(function (resolve, reject) {
        let arr = [];
        consul.catalog.service.nodes('common-redis', function (err, result) {
            if (err) {
                reject(err)
            } else {
                if (result && result.length > 0) {
                    result.forEach(function (val) {
                        let isLan = false;
                        val.ServiceTags.forEach((v) => {
                            if (v.indexOf('lan-service') != -1) {
                                isLan = true;
                                arr.push(`${v.split('=')[1]}:${val.ServicePort}`)
                            }
                        })
                        if (!isLan) {
                            arr.push(`${val.ServiceAddress}:${val.ServicePort}`)
                        }
                    }, this);
                }
                console.log("Redis service " + arr)
                resolve(arr)
            }
        });

    })
}

function getRedisSentinel () {
    return new Promise(function (resolve, reject) {
        let arr = [];
        let obj = {};
        consul.catalog.service.nodes('common-redis-sentinel',function(err, result) {
            if (err) {
                reject(err)
            } else {
                if( result && result.length > 0) {
                    result.forEach(function(val) {
                        let isLan = false;
                        val.ServiceTags.forEach((v)=>{
                            if( v.indexOf('lan-service') != -1 ) {
                                isLan = true;
                                obj = {
                                    host: v.split('=')[1],
                                    port: val.ServicePort
                                }
                                arr.push(obj)
                            }
                        })
                        if( !isLan ) {
                            obj = {
                                host: val.ServiceAddress,
                                port: val.ServicePort
                            }
                            arr.push(obj)
                        }
                    }, this);
                    console.log("Redis service ",arr)
                }
                resolve(arr)
            }
        });

    })
}

module.exports = {
    register: register,
    getGateway: getGateway,
    getRedisHost: getRedisHost,
    getRedisSentinel: getRedisSentinel
};
