/*
 *路由配置说明：
 * @hidden //不在菜单中显示
 * @leaf //只有一个节点
 * @icon //图标样式class
 * @name //国际化标题（父节点菜单则是显示，子节点是显示的标题）
 *
 * */

/*
 * 公用部分
 * */
import NotFoundComponent from '@/views/NotFound'
import Login from '@/views/login/Login'
import Forget from '@/views/login/Forget'
import Home from '@/views/Home'

/*
 * 项目页面,路由组件的懒加载
 * */
const enterprise = resolve => require(['@/views/enterprise/index'], resolve)
const enterpriseEdit = resolve => require(['@/views/enterprise/Edit'], resolve)
const enterpriseDetail = resolve => require(['@/views/enterprise/Detail'], resolve)
const order = resolve => require(['@/views/order/index'], resolve)
const orderAdd = resolve => require(['@/views/order/Add'], resolve)
const orderDetail = resolve => require(['@/views/order/Detail'], resolve)
const setmenu = resolve => require(['@/views/setmenu/index'], resolve)
const setmenuDetail = resolve => require(['@/views/setmenu/Detail'], resolve)
const account = resolve => require(['@/views/Account'], resolve)
const versionView = resolve => require(['@/views/versionView'], resolve)
export default [
    /*
     * 登陆页面
     * */
    {
        path: '/admin/login',
        name: 'login',
        component: Login,
        hidden: true,
    },
    /*
     * 忘记密码页面
     * */
    {
        path: '/ admin/forget',
        name: 'forget',
        component: Forget,
        hidden: true,
    },
    /*
     * 首页
     * */
    {
        path: '/admin',
        component: Home,
        name: 'menu.enterprise',
        icon: 'iconfont icon-qiyeguanli',
        redirect: '/admin/enterprise',
        leaf: true,
        children: [
            {
                path: '/admin/enterprise',
                component: enterprise,
                name: 'enterprise',
                meta:{
                    menu:'/admin/enterprise'
                }
            },
            {
                path: '/admin/enterprise/edit',
                component: enterpriseEdit,
                name: 'enterprise.edit',
                meta:{
                    menu:'/admin/enterprise'
                }
            },
            {
                path: '/admin/enterprise/detail',
                component: enterpriseDetail,
                name: 'enterprise.detail',
                meta:{
                    menu:'/admin/enterprise'
                }
            }
        ]
    },
    {
        path: '/admin',
        component: Home,
        name: 'menu.order',
        icon: 'iconfont icon-ydingdan',
        leaf: true,
        children: [
            {
                path: '/admin/order',
                component: order
            },
            {
                path: '/admin/order/add',
                component: orderAdd,
                name: 'order.add',
                meta:{
                    menu:'/admin/order'
                }
            },
            {
                path: '/admin/order/detail',
                component: orderDetail,
                name: 'order.detail',
                meta:{
                    menu:'/admin/order'
                }
            }
        ]
    },
    {
        path: '/admin',
        component: Home,
        name: 'menu.setmenu',
        icon: 'iconfont icon-taocanguanli',
        leaf: true,
        children: [
            {
                path: '/admin/setmenu',
                component: setmenu
            },
            {
                path: '/admin/setmenu/detail',
                component: setmenuDetail,
                name: 'setmenu.detail',
                meta:{
                    menu:'/admin/setmenu'
                }
            }
        ]
    }, 
    {
        path: '/admin',
        component: Home,
        hidden: true,
        children: [{
            path: '/admin/account',
            component: account
        }]
    },
    {
        path: '/admin',
        component: Home,
        name: 'menu.ver',
        icon: 'iconfont icon-yshujutongji',
        leaf: true,
        children: [{
            path: '/admin/version',
            component: versionView
        }]
    },
    /*
     * 未找到，404
     * */
    {
        path: '/admin',
        component: Home,
        hidden: true,
        children: [{
            path: '/error',
            component: NotFoundComponent,
            hidden: true
        }]
    },
    {
        path: '*',
        component: Home,
        hidden: true,
        children: [{
            path:'*',
            component: NotFoundComponent,
            hidden: true
        }]
    }
    
]
