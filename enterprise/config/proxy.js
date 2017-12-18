module.exports = {
    /*
     --透明代理的配置地方，这里可以配置本地的api接口到服务器，这样就可以做api联调了
     */
    '/enterprise/api/v1': {
        target: 'http://127.0.0.1:3000',
    },
    '/enterprise/front': {
        target: 'http://127.0.0.1:3000',
    },
    '/enterprise/tmp': {
        target: 'http://127.0.0.1:3000',
    }
}
