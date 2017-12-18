const express = require('express')
const config = require('./config/config')
const request = require('request')
const log4js = require('./lib/log4')
const Redis = require('ioredis')
const Consul = require('./lib/consul')
const getServer = require('./lib/serviceDiagnostics')

var app = express();

log4js.use(app)

const env = process.env.NODE_ENV || 'production';
app.locals.ENV = env;

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


exports = module.exports = app;
