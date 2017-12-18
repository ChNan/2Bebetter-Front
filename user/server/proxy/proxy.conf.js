const url = require('url')
const commom = require('../lib/commom')

module.exports = (app) => {
    return {
        '/meeting/api/v1/personal': {
            target: app.get('SER'),
            protocolRewrite: 'http',
            pathRewrite: {
                '^/meeting/api/v1': '/api/v1'
            },
            router: function (req) {
                return app.get('SER');
            },
            onError: function(err, req, res){
                console.error(err)
            },
            onProxyReq: function onProxyReq(proxyReq, req, res) {
                if (req.session && req.session.token) {
                    proxyReq.setHeader('token', req.session.token);
                    proxyReq.setHeader('x-forwarded-for', commom.getClientIP(req));
                }
            },
            onProxyRes: function onProxyRes(proxyRes, req, res) {

            }
        }
    }
}