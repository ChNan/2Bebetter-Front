/*
 *路由配置说明：
 * @hidden //不在菜单中显示
 * @leaf //只有一个节点
 * @icon //图标样式class
 * @label //国际化标题（父节点菜单则是显示，子节点是显示的标题）
 *
 * */

/*
 * 公用部分
 * */
import NotFoundComponent from '@/views/NotFound'
import Login from '@/views/login/Login'
import Forget from '@/views/login/Forget'
import Register from '@/views/login/Register'
import Recovery from '@/views/login/Recovery'
import Activate from '@/views/login/Activate'
import Home from '@/views/Home'

/*
 * 项目页面,路由组件的懒加载
 * */

const Dashboard = resolve => require(['@/views/Dashboard.vue'], resolve)
const AccountTp = resolve => require(['@/views/AccountTp.vue'], resolve)
const State = resolve => require(['@/views/State.vue'], resolve)
const User = resolve => require(['@/views/account/User.vue'], resolve)
const BatchImport = resolve => require(['@/views/account/BatchImport.vue'], resolve)
const Device = resolve => require(['@/views/account/device/index.vue'], resolve)
const DeviceEdit = resolve => require(['@/views/account/device/Edit.vue'], resolve)
const Cloud = resolve => require(['@/views/Cloud.vue'], resolve)
const Room = resolve => require(['@/views/Room.vue'], resolve)
const Orders = resolve => require(['@/views/order/Orders.vue'], resolve)
const Service = resolve => require(['@/views/order/service/index.vue'], resolve)
const Basic = resolve => require(['@/views/setting/Basic.vue'], resolve)
const Call = resolve => require(['@/views/setting/Call.vue'], resolve)
const Enterprise = resolve => require(['@/views/setting/Enterprise.vue'], resolve)
const MeetingDetail = resolve => require(['@/views/analysis/meeting/Detail.vue'], resolve)
const Meeting = resolve => require(['@/views/analysis/meeting/index.vue'], resolve)



export default [
    /*
     * 登陆页面
     * */
    {
        path: '/enterprise/login',
        name: 'login',
        label: 'login',
        component: Login,
        meta: { requiresAuth: true },
        hidden: true
    },
    /*
     * 忘记密码页面
     * */
    {
        path: '/enterprise/forget',
        name: 'forget',
        component: Forget,
        meta: { requiresAuth: true },
        hidden: true,
    },
    /*
     * 重置密码页面
     * */
    {
        path: '/enterprise/recovery',
        name: 'recovery',
        component: Recovery,
        meta: { requiresAuth: true },
        hidden: true,
    },
    /*
     * 企业注册
     * */
    {
        path: '/enterprise/register',
        name: 'register',
        component: Register,
        meta: { requiresAuth: true },
        hidden: true,
    },
    {
        path: '/enterprise/activate',
        name: 'activate',
        component: Activate,
        meta: { requiresAuth: true },
        hidden: true,
    },
    {
        path: '/',
        hidden: true,
        redirect: '/enterprise/dashboard'
    },
    {
        path: '/enterprise',
        hidden: true,
        redirect: '/enterprise/dashboard'
    },
    /*
     * 首页
     * */
    {
        path: '/',
        component: Home,
        label: 'menu.index',
        icon: 'icon-shouye',
        leaf: true,
        children: [{
                path: '/enterprise/dashboard',
                component: Dashboard,
                label: 'menu.index'
            },
            {
                path: '/enterprise/account',
                component: AccountTp,
                hidden: false
            },
            {
                path: '/enterprise/error',
                component: NotFoundComponent,
                hidden: false
            }
        ]
    },
    /*
     * 状态预览
     * */
    {
        path: '/',
        component: Home,
        label: 'menu.state',
        leaf: true,
        icon: 'icon-yzhuangtai',
        children: [{
                path: '/enterprise/state',
                component: State,
                label: 'menu.state',
            }

        ]
    },
    /*
     * 帐号管理
     * */
    {
        path: '/',
        component: Home,
        label: 'menu.account',
        icon: 'icon-yzhanghao',
        children: [{
                path: '/enterprise/user',
                component: User,
                label: 'menu.user' //用户帐号
            },
            {
                path: '/enterprise/batchImport',
                hidden: true,
                meta: {
                    menu: '/enterprise/user' //展开的菜单
                },
                component: BatchImport,
                label: 'menu.batchImport' //批量导入
            },
            {
                path: '/enterprise/device',
                component: Device,
                label: 'menu.device' //会议室设备帐号
            },
            {
                path: '/enterprise/deviceEdit',
                name: 'deviceEdit',
                component: DeviceEdit,
                hidden: true,
                meta: {
                    menu: '/enterprise/device' //展开的菜单

                }
            }
        ]
    },
    /*
     * 会议室管理
     * */
    {
        path: '/',
        component: Home,
        label: 'menu.room',
        icon: 'icon-yhuiyishi',
        leaf: true,
        children: [{
            path: '/enterprise/room',
            component: Room,
            label: 'menu.room' //会议室管理
        }]
    },
    /*
     * 云会场管理
     * */
    {
        path: '/',
        component: Home,
        label: 'menu.cloud',
        icon: 'icon-yyunhuichang',
        leaf: true,
        children: [{
            path: '/enterprise/cloud',
            component: Cloud,
            label: 'menu.cloud' //云会场管理
        }]
    },
    /*
     * 数据统计
     * */
    {
        path: '/',
        component: Home,
        label: 'menu.count', //数据统计
        icon: 'icon-yshujutongji',
        children: [{
            path: '/enterprise/meeting',
            component: Meeting,
            label: 'menu.meeting' //会议统计
        }, {
            path: '/enterprise/meetingDetail',
            component: MeetingDetail,
            meta: {
                menu: '/enterprise/meeting'
            },
            hidden: true,
            name: 'MeetingDetail'
        }]
    },
    /*
     * 订单管理
     * */
    {
        path: '/',
        component: Home,
        label: 'menu.order', //订单管理
        icon: 'icon-ydingdan',
        children: [{
                path: '/enterprise/service',
                component: Service,
                name: 'service',
                label: 'menu.service' //我的服务
            },
            {
                path: '/enterprise/orders',
                component: Orders,
                name: 'orders',
                label: 'menu.orders' //全部订单
            }
        ]
    },
    /*
     * 企业设置
     * */
    {
        path: '/',
        component: Home,
        label: 'menu.setting', //企业设置
        icon: 'icon-yshezhi',
        children: [{
            path: '/enterprise/basic',
            component: Basic,
            label: 'menu.basic' //基本设置
        }, {
            path: '/enterprise/enterprise',

            component: Enterprise,
            label: 'menu.enterprise' //企业信息

        }, {
            path: '/enterprise/call',
            component: Call,
            label: 'menu.call' //通话设置
        }]
    },

    /*
     * 未找到，404
     * */
    {
        path: '*',
        redirect: '/enterprise/error',
        hidden: true
    }
]
