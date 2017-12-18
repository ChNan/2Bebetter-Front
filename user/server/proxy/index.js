const express = require('express')
const proxyMiddleware = require('http-proxy-middleware')


module.exports = (app) => {
    let proxyTable = require('./proxy.conf')(app)
    Object.keys(proxyTable).forEach(function (context) {
        let options = proxyTable[context]
        if (typeof options === 'string') {
            options = {target: options}
        }
        app.use(proxyMiddleware(options.filter || context, options))
    })
};


