module.exports = {
    /*
     --透明代理的配置地方，这里可以配置本地的api接口到服务器，这样就可以做api联调了
     */
    '/meeting/api/v1': {
        target: 'http://localhost:3000',
    },
    '/meeting/front': {
        target: 'http://localhost:3000',
    }
}
