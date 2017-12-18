import Vue from 'vue'
import Router from 'vue-router'
import routes from '@/router/maps'
import auth from '@/services/authService'

import {
    isIE9
} from '@/services/toolService'

Vue.use(Router);

/*
 * @model： history模式  Node配置参考 https://github.com/bripkens/connect-history-api-fallback
 * @base： __dirname 获得当前文件所在目录的完整目录名
 * */
let router = new Router({
    mode: isIE9() ? 'hash' : 'history',
    base: __dirname,
    routes
})



/*
 --登录验证 是否登录
 --如果要到首页,必须验证
 */
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        next()
    } else {
        if (auth.check(true)) {
            auth.updateTimeout();
            if (auth.getEnterprise().enterprise && auth.getEnterprise().enterprise.status == 'expired') {
                to.path != "/enterprise/error" ? next({path: '/enterprise/error', query: {code: 403}}) : next();
            } else {
                next()
            }
        } else {
            next('/enterprise/login')
        }
    }
})

router.afterEach(route => {

})

export default router
