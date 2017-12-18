const express = require('express')
const glob = require('glob')
const config = require('./config')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const RedisStore = require('connect-redis')(session);
const bodyParser = require('body-parser')
const compress = require('compression')
const history = require('connect-history-api-fallback')
const path = require('path')
const proxy = require('../proxy/index')
const Consul = require('../lib/consul')
const getServer = require('../lib/serviceDiagnostics')

module.exports = function (app, config, redis) {
    app.use(cookieParser());
    app.use(session({
        store: new RedisStore({
            client: redis
        }),
        secret: 'yealink',
        name: 'admin.sid',
        cookie: {
            maxAge: config.maxAge,
            secure: false
        },
        resave: true,
        rolling: true,
        saveUninitialized: true
    }));

    app.use(compress());

    //代理
    proxy(app)

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    //接口路由
    const controllers = glob.sync(config.root + '/api/**/*.js');
    controllers.forEach(function (controller) {
        require(controller)(app);
    });

    //HTML5 History 模式
    app.use(history());

    app.use(express.static(path.join(config.root, '/dist')))
    app.get('/', function (req, res) {
        res.sendFile(config.root + '/dist/index.html');
    })

    app.use(function (req, res, next) {
        console.log("404 not find:" + req.originalUrl);
        res.status(404).send('File not found!')
        next();
    });

    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            console.log(err);
            res.status(err.status || 500).send({
                message: err.message,
                error: err,
                title: 'error'
            });
        });
    }
    Consul.register()

    var server = require('http').createServer(app);
    server.listen(config.port, '0.0.0.0', function () {
        var host = this.address().address;
        var port = this.address().port;
        console.log('Service listening http at http://%s:%s, in %s mode', host, port, app.locals.ENV);
    });

    getServer.timer(app)
    setInterval(() => {
        getServer.getServer(app)
    }, 10 * 60 * 1000)
};
