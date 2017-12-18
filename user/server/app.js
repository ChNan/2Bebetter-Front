const express = require('express')
const config = require('./config/config')
const request = require('request')
const srv = require('./config/srv');
const log4js = require('./lib/log4')
const Redis = require('ioredis')
const Consul = require('./lib/consul')
const getServer = require('./lib/serviceDiagnostics')
const srvEnabled = config.srv.enable === true ? 1 : 0;

var app = express();

log4js.use(app)

const env = process.env.NODE_ENV || 'production';
app.locals.ENV = env;

console.log('Service is starting and getting back-end service....')

getServer.getServer(app).then((r) => {
        console.log(`Successful access to the back-end service(${r}) and getting redis service.....`)
        Consul.getRedisSentinel().then((res) => {
                console.log(`Successful access to the redis service(${res}) from common-redis-sentinel`)
                let redis = null;
                if (res.length > 0) {
                    redis = new Redis({
                        sentinels: res,
                        name: 'mymaster',
                        db: parseInt(config.redis.db)
                    })
                    require('./config/express')(app, config, redis);
                } else {
                    Consul.getRedisHost().then((respone) => {
                        console.log(`Successful access to the redis service(${respone}) from commom-redis`)
                        if (respone.length > 0) {
                            redis = new Redis(`redis://@${respone[0]}/${parseInt(config.redis.db)}`)
                            require('./config/express')(app, config, redis);
                        }
                    })
                    .catch((err) => {
                        console.error(err)
                    });
                }

            })
            .catch((err) => {
                console.error(err)
            });
    })
    .catch((err) => {
        console.error(err)
    });


// init srv query
if (srvEnabled) {
    srv.init();
}

exports = module.exports = app;
