const url = require('url')
const commom = require('../lib/commom')

module.exports = (app) => {
    return {
        '/enterprise/api/v1': {
            target: app.get('SER'),
            protocolRewrite: 'http',
            pathRewrite: {
                '^/enterprise/api/v1': '/api/v1'
            },
            router: function (req) {
                return app.get('SER');
            },
            onError: function(err, req, res){
                console.error(err)
            },
            onProxyReq: function onProxyReq(proxyReq, req, res) {
                console.log(req.session && req.session.token)
                if (req.session && req.session.token) {
                    proxyReq.setHeader('token', req.session.token);
                    proxyReq.setHeader('x-forwarded-for', commom.getClientIP(req));
                }
            },
            onProxyRes: function onProxyRes(proxyRes, req, res) {

            }
        },
    }

}
