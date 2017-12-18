/**
 * Created by yl1494 on 2017/7/17.
 */

import NotFoundComponent from '@/views/NotFound'
import Login from '@/views/login/Login'
import Index from '@/views/index/Index'

const routers =[
    /*
     * 登陆页面
     * */
    {
        path: '/login',
        name: '登陆页面',
        component: Login,
        hidden: true,
    },
    /*
     * 首页
     * */
    {
        path: '/index',
        name: '首页',
        component: Index,
        hidden: true,
    },
    /*
     * 未找到，404
     * */
    {
        path: '*', component: NotFoundComponent, hidden: true
    }
]


export {routers};
