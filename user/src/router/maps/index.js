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

const NotFound = resolve => require(['@/views/NotFound'], resolve)
const Login = resolve => require(['@/views/login'], resolve)
const Forget = resolve => require(['@/views/login/Forget'], resolve)
const Recovery = resolve => require(['@/views/login/Recovery'], resolve)
const Activate = resolve => require(['@/views/login/Activate'], resolve)
const Dashboard = resolve => require(['@/views/Dashboard'], resolve)
const Home = resolve => require(['@/views/Home'], resolve)
const Schedule = resolve => require(['@/views/Schedule'], resolve)
const Reservation = resolve => require(['@/views/reservation'], resolve)
const ReservationDetail = resolve => require(['@/views/reservation/Detail'], resolve)
const MeetingControl = resolve => require(['@/views/control'], resolve)
const ControlDetail = resolve => require(['@/views/control/Detail'], resolve)
const Email = resolve => require(['@/views/control/email'], resolve)
const Account = resolve => require(['@/views/Account'], resolve)

/*
 * 项目页面,路由组件的懒加载
 * */


export default [
    /*
     * 登陆页面
     * */
    {
        path: '/meeting/login',
        name: 'login',
        component: Login,
        hidden: true,
    },
    /*
     * 忘记密码页面
     * */
    {
        path: '/meeting/forget',
        name: 'forget',
        component: Forget,
        hidden: true,
    },
    /*
     * 重置密码页面
     * */
    {
        path: '/meeting/recovery',
        name: 'recovery',
        component: Recovery,
        hidden: true,
    },
    /*
     * 重置密码页面
     * */
    {
        path: '/meeting/activate',
        name: 'activate',
        component: Activate,
        hidden: true,
    },
    /*
     * 首页
     * */
    {
        path: '/meeting',
        name: 'dashboard',
        component: Dashboard,
        hidden: true,
    },
    /*
     * 各个功能页
     * */
    {
        path: '/',
        component: Home,
        hidden: true,
        children: [{
                path: '/meeting/index/reservation',
                component: Reservation,
                name: 'title.videoConf',
                hidden: true,
                meta: {
                    hideTitle: true
                },
            },
            {
                path: '/meeting/index/reservationDetail',
                component: ReservationDetail,
                name:'title.videoDetail',
                hidden: true,
                meta: {
                    hideTitle: true
                }
            },
			{
                path: '/meeting/index/meetingDetail',
                component: ReservationDetail,
                name:'title.roomDetail',
                hidden: true,
                meta: {
                    hideTitle: true
                }
            },
            {
                path: '/meeting/index/meetingDetail',
                component: ReservationDetail,
                name:'title.roomDetail',
                hidden: true,
                meta: {
                    hideTitle: true
                }
            },
            // {
            //     path: '/index/join',
            //     component: JoinConf,
            //     name: '加入会议',
            //     hidden: true,
            //     meta: {
            //         hideTitle: true
            //     }
            // },

            {
                path: '/meeting/index/room',
                component: Reservation,
                name: 'title.meetConf',
                hidden: true,
                meta: {
                    hideTitle: true
                }
            },

            {
                path: '/meeting/index/schedule',
                component: Schedule,
                name: 'title.schedule',
                hidden: true,
                meta: {
                    hideTitle: true
                }
            },
            //到邮箱
            {
                path: '/meeting/index/control/email',
                component: Email,
                name: '邮箱',
                hidden: true,
                meta: {
                    hideTitle: true
                }
            },
            {
                path: '/meeting/index/control',
                component: ControlDetail,
                name: 'title.controlConf',
                hidden: true,
                meta: {
                    hideTitle: true
                }
            },

            //父主键
            {
                path: '/meeting/index/ControlList',
                component: MeetingControl,
                name: 'title.controlConf',
                hidden: true,
                meta: {
                    hideTitle: true
                }
            },
            {
                path: '/meeting/Account',
                component: Account,
                name: 'nav.setting',
                hidden: true,
                meta: {
                    hideTitle: true
                },
            },
        ]
    },
    /*
     * 未找到，404
     * */
    {
        path: '*',
        component: NotFound,
        hidden: true
    }
]
